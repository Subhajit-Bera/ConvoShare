
const fileFormat = (url = "") => {
    const fileExt = url.split(".").pop();   //.pop() will give the last element of the array

    if (fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg")
        return "video";

    if (fileExt === "mp3" || fileExt === "wav") return "audio";
    if (
        fileExt === "png" ||
        fileExt === "jpg" ||
        fileExt === "jpeg" ||
        fileExt === "gif"
    )
        return "image";

    return "file";
};

const transformImage=(url="")=>url;

export { fileFormat, transformImage};