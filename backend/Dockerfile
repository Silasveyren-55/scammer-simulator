FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Install Playwright browsers
RUN npx playwright install --with-deps

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
