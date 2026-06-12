
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  buttonClassName?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = '', buttonClassName = 'search-button' }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto" aria-label="Search form">
      <div className="relative group">
        <input
          type="text"
          aria-label="Ask your specialized AI anything"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask your specialized AI anything…"
          className={`${className || 'search-input'} pr-16`}
        />
        <Button
          type="submit"
          size="sm"
          className={`absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 ${buttonClassName}`}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
