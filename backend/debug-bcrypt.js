const bcrypt = require('bcryptjs');

const run = async () => {
    try {
        console.log('Testing bcrypt...');
        const salt = await bcrypt.genSalt(10);
        console.log('Salt:', salt);
        const hash = await bcrypt.hash('password123', salt);
        console.log('Hash:', hash);
    } catch (error) {
        console.error('Bcrypt Error:', error);
    }
};

run();
