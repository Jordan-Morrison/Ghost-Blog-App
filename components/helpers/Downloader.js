import * as FileSystem from 'expo-file-system';
import { getCurrentPositionAsync } from 'expo-location';

export async function downloadPost(post) {

    // Sets the location for which all the post's files should be downloaded to
    const downloadLocation = FileSystem.documentDirectory + "posts/" + post.uuid + "/";

    // Creating the directories for posts and the post itself if they don't already exist
    FileSystem.makeDirectoryAsync(downloadLocation, {intermediates: true}).catch(err => {
        console.error(err);
    });

    // Will receive a list of objects for all the images to be downloaded, or null if there are no images
    let imagesToDownload = await findImages(post.html);

    if (imagesToDownload) {
        // Downloads the images and receives an array containing the image URI's and names
        let downloadedImages = await downloadImages(imagesToDownload, downloadLocation);

        // Loop through the HTML and replace the image URL with the local image URI
        downloadedImages.forEach(image => {
            post.html = post.html.split(image.url).join("./" + image.name);
        });
    }

    // Save the html file
    FileSystem.writeAsStringAsync(downloadLocation + "post.html", post.html).catch(err => {
        console.error(err);
    });

    // Save a JSON file with information about the post
    FileSystem.writeAsStringAsync(downloadLocation + "post.json", JSON.stringify({
        uuid: post.uuid,
        title: post.title,
        excerpt: post.excerpt,
        url: post.url
    })).catch(err => {
        console.error(err);
    });

}

// Parses the HTML to find any images that need to be downloaded
async function findImages(html) {
    // Regex to find all <img/> tags
    let imageTagRegex = new RegExp('<img(.+?)src\s*=\s*\\"(.+?)\\"', "g");
    
    // Returns an array of all the image tags
    let imageTags = html.match(imageTagRegex);

    // If there are no image tags then return null
    if (!imageTags){
        return null;
    }

    // Parse the image tags to create an object containing the image's URL and filename + extension
    let imagesToDownload = await imageTags.map(tag => {
        // Use regex to extract the url from the image tag
        let url = tag.match(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g)[0];
        return {
            url: url,
            name: url.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/g)[0]
        }
    });

    // Remove any duplicate images to prevent extra downloads
    return [...new Set(imagesToDownload)];
}

// Downloads images, receives an array of image objects and a location to save them to
async function downloadImages(imagesToDownload, downloadLocation) {
    // Using a for in loop to better manage promises
    for (let image in imagesToDownload){
        // Create a variable to the curent image for easy access
        image = imagesToDownload[image];

        // Set the filename with the image's index, then name and extenstion. Index prevents possible errors for files with the same name
        let fileName = `${imagesToDownload.indexOf(image)}-${image.name}`;
        // Download the image, receives an object with the response
        let downloaded = await FileSystem.downloadAsync(image.url, downloadLocation + fileName).catch(err => {
            console.error(err);
        });
        // If the image has a URI it has been succesfully downloaded and stored
        if (downloaded.uri){
            // Update the object with the new image path and filename
            imagesToDownload[imagesToDownload.indexOf(image)].uri = downloaded.uri;
            imagesToDownload[imagesToDownload.indexOf(image)].name = fileName;
        }
    }

    // return the array of downloaded image objects
    return imagesToDownload;

}