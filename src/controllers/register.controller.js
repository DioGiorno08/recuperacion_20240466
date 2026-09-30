import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import User from "../models/User.js";
import VerificationCode from "../models/VerificationCode.js";
import { sendVerificationEmail } from "../services/email.service.js";
import { deleteImage, uploadImage } from "../utils/cloudinaryUpload.js";

const normalizeEmail = (email = "") => email.trim().toLowerCase();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  profilePhoto: user.profilePhoto,
  emailVerified: user.emailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const requestRegistrationCode = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { name, password } = req.body;
    if (typeof name !== "string" || !name.trim() || typeof password !== "string" || password.length < 6) return res.status(400).json({ok:false,message:"Nombre y contraseña de al menos 6 caracteres obligatorios"});

    if (!emailPattern.test(email)) {
      return res.status(400).json({ ok: false, message: "Ingresa un correo valido" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ ok: false, message: "Ese correo ya esta registrado" });
    }

    const code = crypto.randomInt(100000, 1000000).toString();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await VerificationCode.findOneAndUpdate(
      { email },
      { codeHash, expiresAt, attempts: 0, name:name.trim(), password:await bcrypt.hash(password,10) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    try {
      await sendVerificationEmail(email, code);
    } catch (emailError) {
      await VerificationCode.deleteOne({ email });
      throw emailError;
    }

    return res.status(200).json({
      ok: true,
      message: "Codigo enviado. Revisa tu correo; vence en 10 minutos.",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyRegistration = async (req, res, next) => {
  let uploadedPublicId;

  try {
    const { verificationCode } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!email || !verificationCode) {
      return res.status(400).json({
        ok: false,
        message: "email y verificationCode son obligatorios",
      });
    }

    if (!req.file) {
      return res.status(400).json({ ok: false, message: "La foto de perfil es obligatoria" });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ ok: false, message: "Ese correo ya esta registrado" });
    }

    const verification = await VerificationCode.findOne({ email });

    if (!verification || verification.expiresAt <= new Date()) {
      return res.status(400).json({
        ok: false,
        message: "El codigo no existe o ya vencio. Solicita uno nuevo.",
      });
    }

    if (verification.attempts >= 5) {
      return res.status(429).json({
        ok: false,
        message: "Demasiados intentos. Solicita un codigo nuevo.",
      });
    }

    const validCode = await bcrypt.compare(String(verificationCode), verification.codeHash);

    if (!validCode) {
      verification.attempts += 1;
      await verification.save();
      return res.status(400).json({ ok: false, message: "Codigo de verificacion incorrecto" });
    }

    const image = await uploadImage(req.file);
    uploadedPublicId = image.public_id;
    const passwordHash = verification.password;

    const user = await User.create({
      name: verification.name,
      email,
      password: passwordHash,
      profilePhoto: {
        url: image.secure_url,
        publicId: image.public_id,
      },
      emailVerified: true,
    });

    await VerificationCode.deleteOne({ email }).catch(() => {});

    return res.status(201).json({
      ok: true,
      message: "Usuario registrado y correo verificado correctamente",
      user: publicUser(user),
    });
  } catch (error) {
    if (uploadedPublicId) {
      await deleteImage(uploadedPublicId).catch(() => {});
    }
    next(error);
  }
};


