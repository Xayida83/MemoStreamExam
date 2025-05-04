import React from 'react';

export const Entry = ({ entry }: { entry: any }) => (
  <section className="bg-gray-50 rounded p-4 my-4">
    <h2 className="text-xl font-bold mb-1">{entry.subject}</h2>
    <div className="text-xs text-gray-500 mb-2">{new Date(entry.date).toLocaleDateString()}</div>
    {/* Första stycket */}
    <p className="mb-2">{entry.content.split('\n')[0]}</p>
    {/* Bild (om finns) */}
    {entry.attachments?.find((a: any) => a.mimeType.startsWith('image/')) && (
      <img
        src={entry.attachments.find((a: any) => a.mimeType.startsWith('image/'))?.url}
        alt={entry.attachments.find((a: any) => a.mimeType.startsWith('image/'))?.filename}
        className="w-full rounded my-2"
      />
    )}
    {/* Resten av texten */}
    <p className="text-sm text-gray-700">{entry.content.split('\n').slice(1).join('\n')}</p>
    {/* Ljud/video (om finns) */}
    {entry.attachments?.find((a: any) => a.mimeType.startsWith('audio/')) && (
      <audio controls className="w-full mt-2">
        <source src={entry.attachments.find((a: any) => a.mimeType.startsWith('audio/'))?.url} />
        Din webbläsare stödjer inte ljuduppspelning.
      </audio>
    )}
    {entry.attachments?.find((a: any) => a.mimeType.startsWith('video/')) && (
      <video controls className="w-full mt-2">
        <source src={entry.attachments.find((a: any) => a.mimeType.startsWith('video/'))?.url} />
        Din webbläsare stödjer inte video.
      </video>
    )}
  </section>
); 