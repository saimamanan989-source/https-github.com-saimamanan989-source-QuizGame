import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in py-20">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-t-2 border-zinc-200 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-r-2 border-zinc-600 rounded-full animate-spin [animation-direction:reverse]"></div>
        <div className="absolute inset-4 border-b-2 border-zinc-800 rounded-full animate-pulse"></div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-medium text-zinc-200 animate-pulse">Constructing Challenge</h3>
        <p className="text-sm text-zinc-500 max-w-xs mx-auto">
          Consulting the neural network for optimal questions...
        </p>
      </div>
    </div>
  );
};

export default Loading;