const ArtistNFT = require("../../models/MarketModel/artistNFT");
const NFTs = require("../../models/MarketModel/NFTs");
const cloudinaryHelpers = require("../../helpers/cloudinaryHelpers");
// this function is for artist NFTs, artist can create new NFT
exports.createNFTService = async (userId, addressWallet, image, name, description, price)=>{
    try {
        const validArtist =  await ArtistNFT.findOne({addressWallet:addressWallet},{user_id:userId}); // get artist
        if (!validArtist) { // if artist is not valid
            return {success:false,message:"Artist not found"};
        }
        const nft = await NFTs.create({ // create NFT
            artistId:validArtist._id,
            image:image,
            price:price,
            description:description,
            name:name});
        if (nft) {
            return {success:true,message:"Create Success!"} // return success
        }
        return {success:false,message:"Create Fail!"} // return fail
    } catch (error) {
        console.log(error);
        
    }
}

// this function is for user, user can get all NFTs
exports.getAllNFTsService = async (filter, search,page,limit) => {
    try {
      let filterOptions = {}; // set filterOptions to empty string
      switch (filter) {
        case "popular":
          filterOptions = { likes: { $gt: 0 } }; // if filter is popular, set filterOptions to likes
          break;
        case "priceAsc":
          filterOptions = { price: 1 }; // if filter is priceAsc, set filterOptions to price
          break;
        case "priceDesc":
          filterOptions = { price: -1 }; // if filter is priceDesc, set filterOptions to price
          break;
        default:
          filterOptions = {};
          break;
      }  
     
      const nfts = await NFTs.find({ // find NFTs
        name: { $regex: search, $options: "i" },
      }).sort({ createdAt: -1 }, filterOptions);
  
      if (nfts) { // if nfts is not empty
        return { success: true, data: nfts };
      }
      return { success: false, message: "Fail to get NFTs" }; // return fail
    } catch (error) {
      console.log(error);
      return { success: false, message: error.toString() };
    }
};

exports.getNFTByArtistService = async (filter, search, typeUser, artistId, page, limit) => {
    try {
      // Kiểm tra xem artist có tồn tại không
      const validArtist = await ArtistNFT.findById(artistId );
      if (!validArtist) {
        return { success: false, message: "Artist not found" };
      }
  
      // Phân trang: chuyển đổi page và limit thành số, tính toán skip
      const pageNumber = parseInt(page) || 1;
      const limitNumber = parseInt(limit) || 8;
      const skip = (pageNumber - 1) * limitNumber;

      
      // Tạo query tìm kiếm với điều kiện tên NFT dựa trên regex
      const query = {
        name: { $regex: typeof search === "string" ? search : "", $options: "i" },
      };
  
      // Thiết lập tiêu chí sắp xếp mặc định
      let sortCriteria = { createdAt: -1 };
  
      // Áp dụng filter theo yêu cầu
      switch (filter) {
        case "popular":
          query.likes = { $gt: 0 };
          break;
        case "priceAsc":
          sortCriteria = { price: 1 };
          break;
        case "priceDesc":
          sortCriteria = { price: -1 };
          break;
        case "isDeleted":
          query.status = false; // Lưu ý: nếu trường trong DB là "staus", hãy sửa lại cho đúng
          break;
        case "Active":
          query.status = true;
          break;
        default:
          break;
      }
  
      // Áp dụng điều kiện theo loại người dùng
      if (typeUser === "artist") {
        // Nếu là artist, chỉ lấy NFT của artist đó
        query.artistId = validArtist._id;
      } else if (typeUser === "customer") {
        // Nếu là customer, chỉ lấy NFT có trạng thái active
        query.status = true;
        // Nếu cần lọc theo addressWallet của customer thì cần truyền thêm tham số (vd: customerAddress)
        // query.addressWallet = customerAddress;
      }
  
      // Thực hiện truy vấn với phân trang, sắp xếp và bỏ qua (skip)
      const nfts = await NFTs.find(query)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limitNumber);
      const totalNft = await NFTs.countDocuments(query);
      if (nfts) {
        return { success: true, data:nfts,totalNft:totalNft };
      }
      return { success: false, message: "Fail to get NFTs" };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.toString() };
    }
  };

exports.updateNFTService = async (id, image, name, description, price) => {
  try {
    const validNFT = await NFTs.findById(id);
    if (!validNFT) {
      return { success: false, message: "NFT not found" };
    }
   if (image) {
    if (image !== validNFT.image) {
      const result = await cloudinaryHelpers.removeFile(validNFT.image);
      if (!result.success) {
        throw new Error("Error removing old image");
      } else {
        validNFT.image = image;
      }
    }
  }
  validNFT.name = name;
  validNFT.description = description;
  validNFT.price = price;
  validNFT.save();
  return { success: true, data: validNFT };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.toString() };
    
  }
}

exports.updateStatusNFtService = async (id) => {
  try {
    const validNFT  =  await NFTs.findById(id);
    if (!validNFT) {
      return { success: false, message: "NFT not found" };
    }
    validNFT.status = !validNFT.status;
    validNFT.save();
    return { success: true, data: validNFT };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

exports.getNFTByIdService = async (id) => {
  try {
    const validNFT = await NFTs.findById(id).populate("artistId","addressWallet name avatar");
    if (!validNFT) {
      return { success: false, message: "NFT not found" };
    }
    return { success: true, data: validNFT };
  } catch (error) {
   console.log(error);
    
  }
}
  