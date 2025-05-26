// Get/api/user
export const getUserData = async (req, res) => {
  try {
    const role = req.user.role;
    const recentSearchedCities = req.user.recentSearchedCities;
    res.json({ success: true, role, recentSearchedCities });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Store User search activities

export const storeUserSearchCities = async (req, res) => {
  try {
    const { recentSearchCity } = req.body;
    const user = req.user;
    if (user.recentSearchedCities.length < 3) {
      user.recentSearchedCities.push(recentSearchCity);
    } else {
      user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchCity);
    }

    await user.save();
    res.json({ success: true, message: "City added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
