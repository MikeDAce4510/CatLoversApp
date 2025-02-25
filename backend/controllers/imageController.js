import fetch from 'node-fetch';

const API_BASE = 'https://api.thecatapi.com/v1';
const API_KEY = process.env.API_KEY;

export async function getRandomImage(req, res) {
  try {
    const response = await fetch(`${API_BASE}/images/search`, {
      headers: { 'x-api-key': API_KEY },
    });
    const data = await response.json();
    if (data.length > 0) {
      res.json(data[0]); // Send the first image object
    } else {
      res.status(404).json({ error: 'No images found' });
    }
  } catch (error) {
    console.error('Error fetching random image:', error);
    res.status(500).json({ error: 'Failed to fetch random image' });
  }
}

export async function getImageById(req, res) {
  const { imageId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM images WHERE id = $1',
      [imageId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching image by ID:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
}
