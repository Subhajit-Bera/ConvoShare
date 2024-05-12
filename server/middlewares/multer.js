import multer from "multer";

//2 type of storage : ram & disk
//1.memory: ram (temporary + fast) (By default storage) : that why we are only setting limits here
//Here we want buffer data which will be store in buffer then we will upload it to cloudinary and then delete it from temporary storage
//2.disk:hardisk (want to store data in folder)

const multerUpload = multer({
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const singleAvatar = multerUpload.single("avatar");

const attachmentsMulter = multerUpload.array("files", 5);

export { singleAvatar, attachmentsMulter };


