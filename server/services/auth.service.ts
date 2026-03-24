import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { userRepository } from "../repositories/user.repository";

export async function login(email: string, password: string) {
  try {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return { success: false, message: "Invalid email or password" };
    }

    return {
      success: true,
      data: { id: user.id, email: user.email, name: user.name },
    };
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Internal server error" };
  }
}

export async function register(
  name: string,
  email: string,
  password: string,
  confirmedPassword: string
) {
  try {
    if (password !== confirmedPassword) {
      return { success: false, message: "Passwords do not match" };
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return { success: false, message: "Email is already in use" };
    }

    const passwordHash = await hashPassword(password);

    const newUser = await userRepository.create({
      name,
      email,
      passwordHash,
    });

    return {
      success: true,
      data: { id: newUser.id, email: newUser.email, name: newUser.name },
    };
  } catch (err) {
    console.error("Register error:", err);
    return { success: false, message: "Internal server error" };
  }
}
