import React, { useCallback } from 'react';
import { Button } from '@gravity-ui/uikit';

import { profileHubStrings } from '../strings/ru';

export type FeedSegment = 'posts' | 'activity' | 'media' | 'pinned';

type FeedFiltersProps = {
  segments: FeedSegment[];
  active: FeedSegment;
  onChange: (segment: FeedSegment) => void;
};

const SEGMENT_LABELS: Record<FeedSegment, string> = {
  posts: profileHubStrings.filters.posts,
  activity: profileHubStrings.filters.activity,
  media: profileHubStrings.filters.media,
  pinned: profileHubStrings.filters.pinned,
};

export const FeedFilters: React.FC<FeedFiltersProps> = ({
  segments,
  active,
  onChange,
}) => {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (segments.length < 2) return;
      const currentIndex = segments.indexOf(active);
      if (currentIndex < 0) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        const next = segments[(currentIndex + 1) % segments.length];
        onChange(next);
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const next = segments[(currentIndex - 1 + segments.length) % segments.length];
        onChange(next);
      }
    },
    [active, onChange, segments],
  );

  return (
    <div className="profile-hub__filters" role="tablist" aria-label="Фильтры ленты" onKeyDown={handleKeyDown}>
      {segments.map((segment) => (
        <Button
          key={segment}
          role="tab"
          size="m"
          view={segment === active ? 'action' : 'outlined'}
          aria-selected={segment === active}
          onClick={() => onChange(segment)}
        >
          {SEGMENT_LABELS[segment]}
        </Button>
      ))}
    </div>
  );
};
