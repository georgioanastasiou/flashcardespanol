### Step 1: Set Up Supabase

1. **Create a Supabase Account**:
   - Go to [Supabase](https://supabase.io/) and sign up for an account.

2. **Create a New Project**:
   - After logging in, click on "New Project".
   - Fill in the project name, password, and select a region.
   - Click "Create new project".

3. **Get API Keys**:
   - Once your project is created, navigate to the "Settings" > "API" section to find your API URL and anon/public API key. You'll need these for your front-end application.

### Step 2: Create a Database Table

1. **Navigate to the Database Section**:
   - Click on "Database" in the left sidebar, then "Table Editor".

2. **Create a New Table**:
   - Click on "New Table".
   - Name your table (e.g., `vocabulary`).
   - Add the following columns:
     - `id`: Integer, Primary Key, Auto Increment
     - `word`: Text
     - `definition`: Text
     - `created_at`: Timestamp, Default value: `now()`

3. **Save the Table**:
   - Click "Save" to create the table.

### Step 3: Build a Front-End Application

You can use any front-end framework or library (like React, Vue, or plain HTML/JavaScript). Below is a simple example using HTML and JavaScript.

#### Example HTML and JavaScript

1. **Create an HTML File** (e.g., `index.html`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vocabulary App</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
</head>
<body>
    <h1>Vocabulary Words</h1>
    <form id="vocab-form">
        <input type="text" id="word" placeholder="Word" required>
        <input type="text" id="definition" placeholder="Definition" required>
        <button type="submit">Add Word</button>
    </form>
    <ul id="vocab-list"></ul>

    <script>
        const { createClient } = supabase;
        const supabaseUrl = 'YOUR_SUPABASE_URL';
        const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
        const supabase = createClient(supabaseUrl, supabaseKey);

        const form = document.getElementById('vocab-form');
        const vocabList = document.getElementById('vocab-list');

        // Fetch vocabulary words
        async function fetchVocabulary() {
            const { data, error } = await supabase
                .from('vocabulary')
                .select('*');
            if (error) console.error(error);
            else {
                vocabList.innerHTML = '';
                data.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = `${item.word}: ${item.definition}`;
                    vocabList.appendChild(li);
                });
            }
        }

        // Add a new vocabulary word
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const word = document.getElementById('word').value;
            const definition = document.getElementById('definition').value;

            const { data, error } = await supabase
                .from('vocabulary')
                .insert([{ word, definition }]);

            if (error) {
                console.error(error);
            } else {
                fetchVocabulary();
                form.reset();
            }
        });

        // Initial fetch
        fetchVocabulary();
    </script>
</body>
</html>
```

### Step 4: Run Your Application

1. **Open the HTML File**:
   - Open `index.html` in your web browser.

2. **Add Vocabulary Words**:
   - Use the form to add new vocabulary words and their definitions. The list will update automatically.

### Step 5: Deploy Your Application (Optional)

You can deploy your application using platforms like Vercel, Netlify, or GitHub Pages for easy access.

### Conclusion

You now have a simple vocabulary word storage application using Supabase! You can expand this project by adding features like editing and deleting words, user authentication, or even a search functionality.