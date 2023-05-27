const { PrismaClient } = require("@prisma/client");
const express = require("express");
const app = express();

const PORT = 3000;
const prisma = new PrismaClient();

// Middleware
app.use(express.json());

// データの取得
app.get("/posts", async (_, res) => {
  const posts = await prisma.posts.findMany();
  return res.json(posts);
});

// 例：データの取得をSQLで書いた場合
// app.get("/users", (_req, res) => {
//   pool.query("SELECT * FROM users", (err, results) => {
//     if (err) throw err;
//     return res.status(200).json(results.rows);
//   });
// });

// 特定のデータの取得(ID)
app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;

  const posts = await prisma.posts.findUnique({
    where: {
      id: Number(id),
    },
  });
  return res.json(posts);
});

// データの作成
app.post("/posts", async (req, res) => {
  const { text, checked } = req.body;
  const posts = await prisma.posts.create({
    data: {
      text,
      checked,
    },
  });
  return res.json(posts);
});

// データの変更
app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { text, checked } = req.body;

  const updatedPost = await prisma.posts.update({
    where: {
      id: Number(id),
    },
    data: {
      text,
      checked,
    },
  });
  return res.json(updatedPost);
});

// 例：データの変更をSQLで書いた場合
// app.put("/users/:id", (req, res) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   pool.query("SELECT * FROM users WHERE id = $1", [id], (err, results) => {
//     if (err) throw err;

//     const isUserExist = results.rows.length;
//     if (!isUserExist) {
//       return res.send("ユーザーが存在しません");
//     }

//     pool.query("UPDATE users SET name = $1 WHERE id = $2", [name, id], (err) => {
//       if (err) throw err;
//       return res.status(200).send(`ユーザー情報を更新しました! `);
//     });
//   });
// });

// データの削除
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const deletedPost = await prisma.posts.delete({
    where: {
      id: Number(id),
    },
  });
  return res.json(deletedPost);
});

// ----------------------------------------

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
