<h1 align="center">backend-eventify</h1>

<p align="center">
  <a href="https://github.com/JuanAlderete/backend-eventify/blob/main/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="https://github.com/JuanAlderete/backend-eventify/issues"><img src="https://img.shields.io/github/issues/JuanAlderete/backend-eventify.svg" alt="Issues"></a>
  <a href="https://github.com/JuanAlderete/backend-eventify/pulls"><img src="https://img.shields.io/github/issues-pr/JuanAlderete/backend-eventify.svg" alt="Pull Requests"></a>
  <a href="https://github.com/JuanAlderete/backend-eventify/graphs/contributors"><img src="https://img.shields.io/github/contributors/JuanAlderete/backend-eventify.svg" alt="Contributors"></a>
</p>

<p align="center">
  <a href="#getting-started">Getting Started</a> •
  <a href="#usage">Usage</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## Getting Started

### Prerequisites

- Node.js
- TypeScript
- Express
- MongoDB
- Helmet
- Cors
- dotenv

### Installation

1. Clone the repository:

```bash
git clone https://github.com/JuanAlderete/backend-eventify.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASS=mysecretpassword
API_KEY=your_api_key_here
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

4. Run the application:

```bash
npm run dev
```

5. Access the application at `http://localhost:3000/api/health`.

## Usage

### Endpoints

- `GET /api/health`: Returns a JSON object with the current status of the application.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for more information.
