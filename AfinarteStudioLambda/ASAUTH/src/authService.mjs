import { getUsersCollection } from './database.mjs';
import { comparePassword, generateToken } from '../utils/auth.mjs';

export const loginUser = async (email, password) => {
  try {
    const usersCollection = await getUsersCollection();
    
    // Buscar usuario por email
    const user = await usersCollection.findOne({ 
      email: email.toLowerCase() 
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    // Verificar si el usuario está activo
    if (user.status !== 'active') {
      throw new Error('Usuario inactivo');
    }

    // Generar token
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      role: user.role || 'user'
    };

    const token = generateToken(tokenPayload);

    // Actualizar último login
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          lastLogin: new Date(),
          lastLoginIP: null // Se puede obtener del event de Lambda
        }
      }
    );

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };

  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const usersCollection = await getUsersCollection();
    
    const user = await usersCollection.findOne(
      { _id: userId },
      { projection: { password: 0 } } // Excluir contraseña
    );

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw error;
  }
};
