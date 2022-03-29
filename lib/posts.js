import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export const getSortedPostsData = () => {
  // get file names under /posts
  const filenames = fs.readdirSync(postsDirectory);
  const allpostsdata = filenames.map((filename) => {
    // remove .md from filename to get id
    const id = filename.replace(/\.md$/, '');

    // read markdown file as string
    const fullpath = path.join(postsDirectory, filename);
    const filecontents = fs.readFileSync(fullpath, 'utf-8');

    // use gray-matter to parse the post metadata section
    const matterresult = matter(filecontents);

    return {
      id,
      ...matterresult.data,
    };
  });

  return allpostsdata.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
};

export function getAllPostIds() {
  const filenames = fs.readdirSync(postsDirectory);

  return filenames.map((filename) => {
    return {
      params: {
        id: filename.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id) {
  const fullpath = path.join(postsDirectory, `${id}.md`);
  const filecontents = fs.readFileSync(fullpath, 'utf-8');

  // use gray-matter to parse the post metadata section
  const matterResult = matter(filecontents);

  // use remark to convert markdown into html string
  const processedcontent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHTML = processedcontent.toString();
  return {
    id,
    contentHTML,
    ...matterResult.data,
  };
}
