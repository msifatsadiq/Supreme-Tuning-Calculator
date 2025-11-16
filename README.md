# Supreme Tuning

A full-stack performance tuning calculator with admin panel for managing BMW, Mercedes-Benz, Audi, and Porsche tuning data.

## 🚀 Features

### Public Calculator
- **Interactive Power Calculator** - Select brand, model, engine, and stage to see power gains
- **Real-time Results** - Instant display of horsepower and torque improvements
- **Smart Rules Engine** - Automatic notes for ECU unlock requirements (BMW 2020+) and CPC upgrades (Mercedes M177/M178 2018+)
- **Beautiful UI** - Modern dark theme with responsive design

### Admin Panel
- **Secure Authentication** - JWT-based login system
- **Data Management** - Edit tuning data with collapsible tree view
- **Auto-Backup System** - Automatic backups on every save with timestamps
- **Real-time Editing** - Update power figures and manage stages instantly

### Backend API
- **RESTful Endpoints** - Clean API for data queries
- **JSON Database** - Simple file-based storage with backup system
- **Puppeteer Scraper** - Modular scraper for DVX data extraction
- **Protected Routes** - JWT middleware for admin operations

## 📁 Project Structure

```
supreme-tuning/
├── backend/
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Auth & other middleware
│   │   └── scraper/         # Puppeteer scraper
│   ├── supreme-tuning.json  # Database
│   ├── backups/             # Auto-backups
│   ├── app.js               # Express app
│   └── server.js            # Server entry
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand state
│   │   └── utils/           # API & helpers
│   └── index.html
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🛠 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

1. **Clone and Install**
```bash
# Install all dependencies
npm run install-all
```

2. **Configure Environment**
```bash
# Copy environment file
cp .env.example backend/.env

# Edit backend/.env with your settings
```

3. **Run Development Servers**
```bash
# Run both backend and frontend
npm run dev

# Or run separately:
npm run dev:backend   # Backend on port 5000
npm run dev:frontend  # Frontend on port 5173
```

4. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:5173/admin/login

## 🔐 Admin Credentials

Default login credentials (change in production):
- **Email**: admin@supa.com
- **Password**: password123

## 📡 API Endpoints

### Public Endpoints
```
GET  /api/brands                              # Get all brands
GET  /api/models?brand={brandId}              # Get models for brand
GET  /api/engines?brand={b}&model={m}         # Get engines
GET  /api/stages?brand={b}&model={m}&engine={e} # Get stages
GET  /api/power?brand={b}&model={m}&engine={e}&stage={s} # Get power data
```

### Admin Endpoints (Protected)
```
POST /api/auth/login                          # Admin login
POST /api/data                                # Get full database
POST /api/save                                # Save database (auto-backup)
GET  /api/backups                             # List backups
```

## 🤖 Scraper Usage

The DVX Puppeteer scraper is a template for extracting tuning data:

```bash
# Run scraper
npm run scrape

# Or directly
node backend/src/scraper/scrapeDvx.js
```

**Note**: Update selectors in `scrapeDvx.js` to match the actual DVX website structure.

## 🐳 Docker Deployment

### Build and Run with Docker Compose

```bash
# Build the image
docker-compose build

# Run the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The application will be available at http://localhost:5000

### Manual Docker Build

```bash
# Build frontend
cd frontend
npm run build
cd ..

# Build and run container
docker build -t supreme-tuning .
docker run -p 5000:5000 -v $(pwd)/backend/supreme-tuning.json:/app/backend/supreme-tuning.json supreme-tuning
```

## 🌐 Production Deployment

### Render / Railway / Heroku

1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `ADMIN_EMAIL=your-email`
   - `ADMIN_PASS=secure-password`
   - `JWT_SECRET=your-secret-key`
   - `FRONTEND_URL=https://your-domain.com`
4. Deploy!

### Build for Production

```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd ../backend
NODE_ENV=production npm start
```

## 🎯 Key Features Explained

### Special Rules Engine

The system automatically adds notes based on specific conditions:

**BMW Rule** - Built after June 2020
```javascript
if (brand === "BMW" && year >= 2020 && month >= 6) {
  note: "⚠️ ECU unlock required"
}
```

**Mercedes Rule** - M177/M178 from 2018+
```javascript
if (brand === "Mercedes" && engine in ["M177", "M178"] && year >= 2018) {
  note: "⚠️ CPC upgrade required"
}
```

### Auto-Backup System

Every time you save data, the system:
1. Creates a timestamped backup in `backend/backups/`
2. Format: `backup-2025-11-16T18-22-35.json`
3. Preserves full database state
4. Allows easy rollback if needed

### Database Structure

```json
{
  "brands": [
    {
      "id": "bmw",
      "name": "BMW",
      "models": [
        {
          "id": "m5-f90",
          "name": "M5 F90",
          "year": "2021",
          "month": "8",
          "engines": [
            {
              "id": "s63b44t4",
              "name": "S63B44T4",
              "stages": [
                {
                  "stage": "1",
                  "stockHP": 600,
                  "stockNM": 750,
                  "tunedHP": 700,
                  "tunedNM": 900,
                  "notes": []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## 🧪 Testing the MVP

1. **Test Public Calculator**
   - Visit http://localhost:5173
   - Select: BMW → M5 F90 → S63B44T4 → Stage 1
   - Verify power gains display correctly
   - Check for ECU unlock warning (2021 model)

2. **Test Admin Panel**
   - Visit http://localhost:5173/admin/login
   - Login with demo credentials
   - Edit a power value
   - Click "Save Changes"
   - Check `backend/backups/` for new backup file

3. **Test API Directly**
```bash
# Get brands
curl http://localhost:5000/api/brands

# Get power data
curl "http://localhost:5000/api/power?brand=bmw&model=m5-f90&engine=s63b44t4&stage=1"

# Login (get token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@supa.com","password":"password123"}'
```

## 📊 Sample Data Included

The MVP comes with pre-loaded data for:

- **BMW**: M5 F90, M3 G80, M2 Competition
- **Mercedes-Benz**: C63 S, E63 S, AMG GT 63 S
- **Audi**: RS6 Avant C8, RS3 8Y
- **Porsche**: 911 Turbo S 992, Cayenne Turbo

Each with Stage 1 and Stage 2 tuning data.

## 🔧 Configuration

### Backend Environment Variables

```bash
# Server
PORT=5000
NODE_ENV=development

# Admin Authentication
ADMIN_EMAIL=admin@supa.com
ADMIN_PASS=password123

# JWT
JWT_SECRET=your-secret-key

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables

Create `frontend/.env`:
```bash
VITE_API_URL=http://localhost:5000/api
```

## 📝 Development Notes

### Adding New Brands

1. Edit `backend/supreme-tuning.json` or use Admin Panel
2. Follow the JSON structure
3. Add year and month for rule engine to work
4. Save and backup is automatic

### Customizing UI

- Colors: Edit `frontend/tailwind.config.js`
- Components: Located in `frontend/src/components/`
- Styles: Main CSS in `frontend/src/index.css`

### Extending the Scraper

1. Open `backend/src/scraper/scrapeDvx.js`
2. Update `baseUrl` with actual DVX URL
3. Inspect DVX site and update CSS selectors
4. Test with: `npm run scrape`

## 🚨 Security Notes

- Change default admin credentials in production
- Use strong JWT_SECRET (generate with `openssl rand -base64 32`)
- Enable HTTPS in production
- Consider rate limiting for public endpoints
- Keep dependencies updated

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port is in use
lsof -i :5000

# Install dependencies
cd backend && npm install
```

### Frontend won't start
```bash
# Install dependencies
cd frontend && npm install

# Clear cache
rm -rf node_modules .vite
npm install
```

### CORS errors
- Check `FRONTEND_URL` in `backend/.env`
- Verify proxy settings in `frontend/vite.config.js`

### Authentication errors
- Clear localStorage: `localStorage.clear()` in browser console
- Check JWT_SECRET matches in backend
- Verify credentials in .env

## 📦 Technologies Used

### Backend
- **Express.js** - Web framework
- **JWT** - Authentication
- **Puppeteer** - Web scraping
- **Helmet** - Security headers
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Routing

## 🎉 Next Steps

To enhance this MVP:

1. **Add More Brands** - Expand database with more vehicles
2. **Advanced Search** - Add search/filter functionality
3. **Comparison Tool** - Compare multiple configurations
4. **Price Calculator** - Add tuning service pricing
5. **User Accounts** - Multi-user admin system
6. **Database Migration** - Move to PostgreSQL/MongoDB
7. **Analytics Dashboard** - Track popular searches
8. **Export Functionality** - PDF/CSV exports

## 📄 License

This project is provided as-is for demonstration purposes.

## 👨‍💻 Support

For issues or questions:
1. Check existing documentation
2. Review API responses in browser DevTools
3. Check server logs: `npm run dev:backend`
4. Verify environment configuration

---

**Built with ❤️ for Supreme Tuning**

Ready to impress your client! 🚀
