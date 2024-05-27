import "dotenv/config";
import { Router } from "express";
import { upload } from "../../middleware/multer.js";
import cld from "../../utils/cloudinary.js";
import Fingerprint from "../../../Schema/Fingerprint.js";


/**
 * cloudinary.v2.api
  .delete_resources(['jvcxp60katxeaznwmexv'], 
    { type: 'upload', resource_type: 'image' })
  .then(console.log);
 */

const router = Router()
// upload.single('file'),
/** POST: http://localhost:8080/uploads  */
router.post("", async function (req, res) {
    const data = await req.body
    try{
    const result = await cld.cloudinary.uploader.upload(data.imageURL, function (err, result){
        if(err) {
          console.log(err);
        }
    })
    if(result){
        return res.json({message: "Image uploaded", data: result})
    }
    res.status(500).json({message: "Something went wrong."})
} catch (error) {
    console.log(error)
    return res.status(500).json({message: "Something went wrong."})
}
});
router.post("/fingerPrint", async function (req, res) {
    const data = await req.body
    try{
    const result = await cld.cloudinary.uploader.upload(data.imageURL, function (err, result){
        if(err) {
          console.log("err LINE 40: ", err);
        }
        return result
    })
    if(result){
      const fingerModel = new Fingerprint({
        template: result.secure_url
      })
      fingerModel.save()
      return res.json({message: "Fingerprint registered", data: fingerModel})
    }
    res.status(500).json({message: "Something went wrong."})
} catch (error) {
    console.log(error)
    return res.status(500).json({message: "Something went wrong."})
}
});

export default router;
