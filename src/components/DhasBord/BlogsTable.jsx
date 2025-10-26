import React from "react";
import Loading from "../../pages/Loading";

const BlogsTable = ({ blogs }) => {
  if (!blogs || blogs.length === 0) return <Loading/>;

  return (
    <table className="w-full bg-white rounded shadow overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-3 text-left">Title</th>
          <th className="p-3 text-left">Author</th>
          <th className="p-3 text-left">Likes</th>
        </tr>
      </thead>
      <tbody>
        {blogs.map((b) => (
          <tr key={b._id} className="border-b">
            <td className="p-3">{b.title}</td>
            <td className="p-3">{b.author}</td>
            <td className="p-3">{b.likes ?? 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BlogsTable;
