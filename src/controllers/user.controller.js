import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {deleteImage,uploadImage} from "../utils/cloudinaryUpload.js";
const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  profilePhoto: user.profilePhoto,
  emailVerified: user.emailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});


export const getUsers = async (_req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ ok: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    return res.json({ ok: true, user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  let newPublicId;

  try {
    const user = await User.findById(req.params.id).select("+password");
    if (!user) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });

    const oldPublicId = user.profilePhoto.publicId;

    if (req.body.name?.trim()) user.name = req.body.name.trim();
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({
          ok: false,
          message: "La contrasena debe tener al menos 6 caracteres",
        });
      }
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.file) {
      const image = await uploadImage(req.file);
      newPublicId = image.public_id;
      user.profilePhoto = { url: image.secure_url, publicId: image.public_id };
    }

    await user.save();

    if (newPublicId) {
      await deleteImage(oldPublicId).catch(() => {});
    }

    return res.json({
      ok: true,
      message: "Usuario actualizado correctamente",
      user: publicUser(user),
    });
  } catch (error) {
    if (newPublicId) {
      await deleteImage(newPublicId).catch(() => {});
    }
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });

    await deleteImage(user.profilePhoto.publicId).catch(() => {});

    return res.json({ ok: true, message: "Usuario e imagen eliminados correctamente" });
  } catch (error) {
    next(error);
  }
};
