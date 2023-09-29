const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const deleteFile = async(urlCortado, path, type) => {

    const idImg = urlCortado[urlCortado.length - 1];
    const [public_id] = idImg.split('.');
    await cloudinary.uploader.destroy(path + public_id, {resource_type:type});
}


module.exports = {
    deleteFile
}