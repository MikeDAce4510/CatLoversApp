import pool from '../models/db.js';

export async function submitVote(req, res) {
  const { image_id, value, image_url } = req.body; // ✅ Get `image_url` from frontend

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const userId = req.user.userId;
  console.log(`🔍 Recording vote: User ${userId}, Image ${image_id}, Value ${value}`);

  try {
    // ✅ Insert vote
    const voteResult = await pool.query(
      'INSERT INTO votes (image_id, value, user_id) VALUES ($1, $2, $3) RETURNING id',
      [image_id, value, userId]
    );

    // ✅ Check if the image already exists
    const imageCheck = await pool.query('SELECT * FROM images WHERE id = $1', [image_id]);

    if (imageCheck.rows.length === 0) {
      // ✅ If not, insert the image URL
      await pool.query(
        'INSERT INTO images (id, url) VALUES ($1, $2)',
        [image_id, image_url]
      );
      console.log(`✅ Image saved: ${image_id} -> ${image_url}`);
    }

    console.log(`✅ Vote successfully recorded: ${voteResult.rows[0].id}`);
    res.status(201).json({ message: 'Vote recorded' });
  } catch (error) {
    console.error('❌ Error recording vote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getAllUserVotes(req, res) {
  try {
    console.log(`🔍 Fetching voting history for ALL users`);

    const result = await pool.query(
      `SELECT v.id, v.value, v.image_id, 
              i.url AS image_url, 
              u.username
       FROM votes v
       LEFT JOIN images i ON v.image_id = i.id
       JOIN users u ON v.user_id = u.id
       ORDER BY v.created_at DESC
       LIMIT 50`
    );

    console.log('✅ Retrieved all user votes:', result.rows.length, 'votes found');
    console.log('🔍 Raw Query Result:', JSON.stringify(result.rows, null, 2));

    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching all user votes:', error);
    res.status(500).json({ error: 'Failed to fetch all user votes' });
  }
}

export async function getUserVotes(req, res) {
  try {
    if (!req.user) {
      console.error('❌ No user ID in token:', req.user);
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.userId;
    console.log(`🔍 Fetching votes for user ID: ${userId}`);

    const result = await pool.query(
      `SELECT v.id, v.value, v.image_id, 
              i.url AS image_url, 
              u.username
       FROM votes v
       LEFT JOIN images i ON v.image_id = i.id
       JOIN users u ON v.user_id = u.id
       WHERE v.user_id = $1
       ORDER BY v.created_at DESC
       LIMIT 20`,
      [userId]
    );

    console.log('✅ Query Result:', result.rows.length, 'votes found');
    console.log('🔍 Raw Query Result:', JSON.stringify(result.rows, null, 2));

    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching user votes:', error);
    res.status(500).json({ error: 'Failed to fetch user votes' });
  }
}










