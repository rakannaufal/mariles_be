const { saveInfoLes } = require("../services/firebaseService");

const createInfoLes = async (req, res) => {
  const {
    lesName,
    description,
    phone,
    address,
    selectedLocation,
    selectedClass,
    selectedFacilities,
    bannerUri,
    bannerFileName,
    detailImages,
    dayFrom,
    dayTo,
    timeFrom,
    timeTo,
    pengajar_id,
  } = req.body;

  if (!lesName || !phone || !address || !selectedLocation || !selectedClass) {
    return res.status(400).json({
      success: false,
      message: "Nama, No Handphone, Alamat, dan Pilihan wajib diisi.",
    });
  }

  if (!dayFrom || !dayTo || !timeFrom || !timeTo) {
    return res.status(400).json({
      success: false,
      message: "Hari Operasional dan Jam Operasional wajib diisi.",
    });
  }

  try {
    const dataToSave = {
      lesName,
      description,
      phone,
      address,
      selectedLocation,
      selectedClass,
      selectedFacilities,
      bannerUri,
      bannerFileName,
      detailImages,
      dayFrom,
      dayTo,
      timeFrom,
      timeTo,
      pengajar_id,
    };

    const result = await saveInfoLes(dataToSave);
    if (result.success) {
      return res.status(200).json({ success: true, message: result.message });
    } else {
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createInfoLes };
