"use strict";
const { Client } = require("pg");

const client = new Client({
  connectionString: 'postgresql://postgres.xetbuzzfgtoeijwxzqaj:Supabase1302@aws-0-us-west-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => {
    console.log('Connected to the database');
    return client.end();
  })
  .catch(err => console.error('Connection error:', err.stack));
