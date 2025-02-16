const cloudinary = require("../utils/cloudinary");

exports.removeFile = async (imageUrl) => {
  try {
    const publicId = imageUrl.split("/").pop().split(".")[0];
    // Xóa hình ảnh trên Cloudinary
    
    const result = await cloudinary.uploader.destroy(`YSoul/${publicId}`);

    // Kiểm tra nếu kết quả trả về là 'not found'
    if (result.result === "not found") {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};
