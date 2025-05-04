import React from 'react';

export const PostGallery = ({ posts }: { posts: any[] }) => (
  <section className="my-4">
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {posts.map((post) => (
        <div key={post.id} className="min-w-[200px] bg-gray-100 rounded p-2 flex-shrink-0">
          <div className="font-bold text-lg">{post.subject}</div>
          <div className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString()}</div>
          <div className="text-sm mt-1 line-clamp-3">{post.content.split('\n')[0]}</div>
        </div>
      ))}
    </div>
  </section>
); 