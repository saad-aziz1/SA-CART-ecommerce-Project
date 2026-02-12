import multer from 'multer';

const storage = multer.diskStorage({
    // 1: Destination 
    destination: function (req, file, callback) {
        callback(null, 'uploads/'); 
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });
export default upload;