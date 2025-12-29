import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://yovxeluqgvndgadnixaf.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImUzYzFiN2Y4LTRmMmUtNDIxYi05MzIyLWVjOWMxNTcyZGNlZSJ9.eyJwcm9qZWN0SWQiOiJ5b3Z4ZWx1cWd2bmRnYWRuaXhhZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTcyMzM4LCJleHAiOjIwODIzMzIzMzgsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.4MIKROoXEQDf5IexgLpYOU4LCWa-97fpuFyN1cg0gqA';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };