# Creating an Admin User

This guide explains how to create an admin user in the RawRecruit backend using the `npm run create-admin` script.

## Prerequisites

1. **Navigate to the BackEnd directory**: Ensure you're in the `BackEnd` folder of your project (e.g., `cd BackEnd` from the root).
2. **Install dependencies**: Run `npm install` to ensure all packages (like `mongoose`, `bcryptjs`, etc.) are installed.
3. **Set up environment variables**: The script loads a `.env` file from the `BackEnd` root. Make sure it exists and contains:
   - `DB_URL`: Your MongoDB connection string (e.g., `mongodb://localhost:27017/yourdb` or a cloud URI).
4. **MongoDB running**: Ensure MongoDB is running locally or accessible via your `DB_URL`.
5. **Node.js**: Ensure you have Node.js installed (version compatible with ES modules, as your project uses `"type": "module"`).

## Steps to Run

1. **Open a terminal** and navigate to the `BackEnd` directory:
   ```
   cd path/to/your/project/BackEnd
   ```

2. **Run the script**:
   ```
   npm run create-admin
   ```
   - This executes `node src/scripts/createAdmin.js`.
   - The script will:
     - Connect to your MongoDB database.
     - Check if an admin user with email `admin@rawrecruit.com` already exists.
     - If not, create a new admin user with:
       - Name: `Admin User`
       - Email: `admin@rawrecruit.com`
       - Password: `admin123` (hashed for security)
       - User Type: `admin`
     - Output success/failure messages to the console.

3. **Expected output** (on success):
   ```
   Connected to MongoDB
   Admin user created successfully!
   Email: admin@rawrecruit.com
   Password: admin123
   ```
   - If the admin already exists, it will say: `Admin user already exists`.

## Additional Notes

- **Security**: The default password (`admin123`) is for testing. Change it immediately after creation via your app's admin panel or database tools.
- **Customization**: If you need to modify the admin details (e.g., email or password), edit `src/scripts/createAdmin.js` directly.
- **Testing**: After running, verify the user in your MongoDB (e.g., via MongoDB Compass or your app's login).
- **Troubleshooting**: If the script fails, check the console for errors. Ensure all dependencies are installed and your environment is set up correctly.