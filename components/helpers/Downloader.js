import * as FileSystem from 'expo-file-system';
import ytdl from 'react-native-ytdl';

export async function downloadPost(post) {

    // Sets the location for which all the post's files should be downloaded to
    const downloadLocation = FileSystem.documentDirectory + "posts/" + post.uuid + "/";

    // Creating the directories for posts and the post itself if they don't already exist
    FileSystem.makeDirectoryAsync(downloadLocation, {intermediates: true}).catch(err => {
        console.error(err);
    });

    let videosToDownload = await findVideos(post.html);

    // Will receive a list of objects for all the images to be downloaded, or null if there are no images
    let imagesToDownload = await findImages(post.html);

    if (post.feature_image){
        var featuredImageName = await fetch(post.feature_image);
        featuredImageName = "featuredImage." + featuredImageName.headers.get("content-type").split("/")[1];
        if (!imagesToDownload){
            imagesToDownload = [];
        }
        imagesToDownload.push({
            name: featuredImageName,
            url: post.feature_image
        })
    }

    if (videosToDownload) {
        let downloadedVideos = await downloadVideos(videosToDownload, downloadLocation);

        downloadedVideos.forEach(video => {
            let videoCode = `<video poster="${video.name + "_thumbnail.jpg"}" controls><source src="./${video.name}" type="video/${video.extension}"></video>`;

            post.html = post.html.split(video.embeddedCode).join(videoCode);

            imagesToDownload.push({
                name: video.name + "_thumbnail.jpg",
                url: video.thumbnailURL
            })
        });
    }

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
        primary_tag: post.primary_tag,
        excerpt: post.excerpt,
        url: post.url,
        feature_image: downloadLocation + featuredImageName
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
        let url = tag.match(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.?[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g)[0];
        return {
            url: url,
            // Set the filename with the image's index, then name and extenstion. Index prevents possible errors for files with the same name
            name: imageTags.indexOf(tag) + "-" + url.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/g)[0]
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

        // Download the image, receives an object with the response
        let downloaded = await FileSystem.downloadAsync(image.url, downloadLocation + image.name).catch(err => {
            console.error(err);
        });
        // If the image has a URI it has been succesfully downloaded and stored
        if (downloaded.uri){
            // Update the object with the new image path and filename
            imagesToDownload[imagesToDownload.indexOf(image)].uri = downloaded.uri;
        }
    }

    // return the array of downloaded image objects
    return imagesToDownload;

}

async function findVideos(html) {
    let embeds = html.match(/<figure[^>]*?kg-card[^"]*?kg-embed-card.*?<\/figure>|(<!--kg-card-begin: embed).*?(kg-card-end: embed-->)/g);

    if (!embeds){
        return null;
    }

    embeds = embeds.filter(embeddedCode => {
        return embeddedCode.includes("youtube");
    });

    let videosToDownload = await embeds.map(embeddedCode => {
        // Use regex to extract the url from the embedded code
        let url = embeddedCode.match(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.?[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g)[0];
        return {
            url: url,
            embeddedCode: embeddedCode
        }
    });

    return [...new Set(videosToDownload)];
}

async function downloadVideos(videosToDownload, downloadLocation){
    for (let video in videosToDownload){
        video = videosToDownload[video];

        let videoData = null;
        try {
            videoData = await getVideoData(video.url);
        }
        catch(err) {
            throw new Error('Something went wrong.');
        }

        let fileName = `${videosToDownload.indexOf(video)}.${videoData.extension}`;
        
        let downloaded = await FileSystem.downloadAsync(videoData.url, downloadLocation + fileName).catch(err => {
            console.error(err);
        });

        if (downloaded.uri){
            console.log("VIDEO: ", video);
            videosToDownload[videosToDownload.indexOf(video)] = {
                uri: downloaded.uri,
                name: fileName,
                embeddedCode: video.embeddedCode,
                extension: videoData.extension,
                thumbnailURL: videoData.thumbnailURL
            }
        }
    }

    return videosToDownload;
}

function getVideoData(url) {
    return new Promise((resolve, reject) => {
        ytdl.getInfo(url, {}, (err, info) => {
        let format = ytdl.chooseFormat(info.formats, {quality: 'highest'});

        let videoData = {
            url: format.url,
            extension: format.container,
            thumbnailURL: `https://img.youtube.com/vi/${ytdl.getURLVideoID(url)}/maxresdefault.jpg`
        }

        if(err) {
            reject(err);
        }
        else {
            resolve(videoData);
        }

        })
    })
}