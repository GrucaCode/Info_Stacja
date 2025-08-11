import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: "Nieprawidłowy e-mail lub hasło" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Nieprawidłowy e-mail lub hasło" });
    }
    req.session.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };

    res.json({ success: true });
  } catch (error) {
    console.error("Błąd logowania:", error);
    res.status(500).json({ success: false, message: "Błąd serwera" });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get('/me', (req, res) => {
  if (req.session.user) {
    return res.json({ loggedIn: true, user: req.session.user });
  }
  res.json({ loggedIn: false });
});

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Użytkownik już istnieje. Podaj inne dane' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Utworzenie Usera
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });
    
    // Automatyczne logowanie po rejestracji
    req.session.user = {
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName
    };

    res.json({ success: true, message: ''});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Błąd serwera przy rejestracji' });
  }
});

export default router;