import type { VotingCatalogItem, VotingImportPayload, VotingImportPreview, VotingImportResult } from '../api/votings';
import type { Nomination } from '../data/nominations';
import type { VoteResult } from '../api/nominations';
import type { AdminStats, AdminVoting, AdminVotingListItem } from '../api/adminVotings';
import type { Game } from '../types/games';
import type { AccountProfile } from '../services/api';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const futureDeadline = '2025-02-10T12:00:00Z';
const pastDeadline = '2024-12-01T12:00:00Z';

const votingCatalog: VotingCatalogItem[] = [
  {
    id: 'vote-active',
    title: 'AEF Game Jam · основной поток',
    description: 'Свежие проекты сообщества.',
    isActive: true,
    isOpen: true,
    isPublic: true,
    deadlineAt: futureDeadline,
    showVoteCounts: false,
    rules: null,
    nominationCount: 2,
  },
  {
    id: 'vote-paused',
    title: 'Экспресс-опрос',
    description: 'Тестируем режим паузы.',
    isActive: false,
    isOpen: false,
    isPublic: true,
    deadlineAt: futureDeadline,
    showVoteCounts: true,
    rules: null,
    nominationCount: 1,
  },
  {
    id: 'vote-archived',
    title: 'Архив 2024',
    description: 'Архивное голосование.',
    isActive: false,
    isOpen: true,
    isPublic: true,
    deadlineAt: pastDeadline,
    showVoteCounts: false,
    rules: null,
    nominationCount: 0,
  },
];

const nominationList: Nomination[] = [
  {
    id: 'nom-1',
    title: 'Лучшая графика',
    description: 'Выбираем самый красивый проект.',
    kind: 'game',
    options: [
      { id: 'opt-1', title: 'Crystal Quest' },
      { id: 'opt-2', title: 'Shadow Trails' },
    ],
    voting: {
      id: 'vote-active',
      title: 'AEF Game Jam · основной поток',
      isActive: true,
      isOpen: true,
      isPublic: true,
      deadlineAt: futureDeadline,
    },
  },
  {
    id: 'nom-2',
    title: 'Лучший геймплей',
    description: 'Главный фокус — механики и баланс.',
    kind: 'game',
    options: [
      { id: 'opt-3', title: 'Drone Racer' },
      { id: 'opt-4', title: 'Orbit' },
    ],
    voting: {
      id: 'vote-paused',
      title: 'Экспресс-опрос',
      isActive: false,
      isOpen: false,
      isPublic: true,
      deadlineAt: futureDeadline,
    },
  },
];

const nominationDetail: Nomination = {
  id: 'nom-detail',
  title: 'Выбор редакции',
  description: 'Номинация для витринного теста.',
  kind: 'game',
  options: Array.from({ length: 7 }, (_, index) => ({
    id: `opt-${index + 1}`,
    title: `Игра ${index + 1}`,
    imageUrl: index % 2 === 0 ? `https://example.com/${index + 1}.png` : undefined,
    game: {
      id: `game-${index + 1}`,
      title: `Game ${index + 1}`,
      genre: index % 2 === 0 ? 'Action' : 'Puzzle',
      studio: 'AEF Studio',
      releaseYear: 2024,
      description: 'Описание игры для тестов.',
      imageUrl: index % 2 === 0 ? `https://example.com/${index + 1}.png` : null,
    },
  })),
  counts: {
    'opt-1': 12,
    'opt-2': 8,
    'opt-3': 5,
    'opt-4': 3,
    'opt-5': 1,
    'opt-6': 0,
    'opt-7': 0,
  },
  userVote: 'opt-2',
  isVotingOpen: true,
  canVote: true,
  requiresTelegramLink: false,
  votingDeadline: futureDeadline,
  voting: {
    id: 'vote-active',
    title: 'AEF Game Jam · основной поток',
    isActive: true,
    isOpen: true,
    isPublic: true,
    deadlineAt: futureDeadline,
  },
};

const votingImportPayload: VotingImportPayload = {
  code: 'vote-import',
  title: 'Импортированное голосование',
  description: 'Тестовый импорт',
  order: 1,
  isActive: true,
  showVoteCounts: false,
  rules: { notes: 'import' },
  deadlineAt: futureDeadline,
  nominations: [
    {
      id: 'nom-import',
      title: 'Импорт номинации',
      description: 'Импортированное описание',
      order: 1,
      kind: 'game',
      options: [
        {
          id: 'opt-import',
          title: 'Импортированная игра',
          order: 1,
          imageUrl: null,
          game: {
            id: 'game-import',
            title: 'Game Import',
            genre: 'Indie',
            studio: 'AEF Studio',
            releaseYear: 2024,
            description: 'Описание из импорта',
            imageUrl: null,
          },
          payload: null,
        },
      ],
    },
  ],
};

const votingImportPreview: VotingImportPreview = {
  voting: votingImportPayload,
  willReplace: false,
  totals: {
    nominations: votingImportPayload.nominations.length,
    options: votingImportPayload.nominations[0].options.length,
    games: 1,
  },
};

const votingImportResult: VotingImportResult = {
  ...votingImportPreview,
  replacedExisting: false,
  createdGames: 1,
  updatedGames: 0,
};

const voteResult: VoteResult = {
  nominationId: 'nom-detail',
  optionId: 'opt-3',
  counts: {
    'opt-1': 12,
    'opt-2': 8,
    'opt-3': 9,
    'opt-4': 3,
    'opt-5': 1,
    'opt-6': 0,
    'opt-7': 0,
  },
  userVote: 'opt-3',
  isVotingOpen: true,
  canVote: true,
  votingDeadline: futureDeadline,
};

const adminVotingList: AdminVotingListItem[] = [
  {
    id: 'vote-active',
    title: 'AEF Game Jam · основной поток',
    description: 'Свежие проекты сообщества.',
    status: 'active',
    deadlineAt: futureDeadline,
    nominationCount: 2,
    isPublished: true,
    isActive: true,
    isOpen: true,
  },
  {
    id: 'vote-archived',
    title: 'Архив 2024',
    description: 'Архивное голосование.',
    status: 'archived',
    deadlineAt: pastDeadline,
    nominationCount: 0,
    isPublished: true,
    isActive: false,
    isOpen: false,
  },
  {
    id: 'vote-draft',
    title: 'Черновик нового потока',
    description: 'Готовим черновик, пока недоступен публично.',
    status: 'draft',
    deadlineAt: null,
    nominationCount: 0,
    isPublished: false,
    isActive: true,
    isOpen: true,
  },
];

const adminVotingDetail: AdminVoting = {
  ...adminVotingList[0],
  nominations: [
    { id: 'nom-1', title: 'Лучшая графика', status: 'active', votes: 20, updatedAt: futureDeadline, kind: 'game' },
    { id: 'nom-2', title: 'Лучший звук', status: 'draft', votes: null, updatedAt: null, kind: 'game' },
  ],
  isPublished: true,
};

const adminStats: AdminStats = {
  activeVotings: 2,
  draftVotings: 1,
  archivedVotings: 1,
  totalVotes: 320,
  uniqueVoters: 180,
  openNominations: 8,
  openForVoting: 2,
};

const games: Game[] = [
  {
    id: 'game-1',
    title: 'Crystal Quest',
    genre: 'Adventure',
    studio: 'AEF Studio',
    releaseYear: 2024,
    description: 'Описание для витрины игр.',
    imageUrl: 'https://example.com/crystal.png',
  },
  {
    id: 'game-2',
    title: 'Shadow Trails',
    genre: 'Action',
    studio: 'Indie Hub',
    releaseYear: 2023,
    description: 'Второй тестовый проект.',
    imageUrl: null,
  },
];

const superuser: AccountProfile = {
  username: 'root',
  email: 'root@example.com',
  first_name: 'Root',
  last_name: 'User',
  avatar_url: 'https://example.com/avatar.png',
  avatar_source: 'upload',
  avatar_gravatar_enabled: false,
  has_2fa: true,
  oauth_providers: ['github'],
  email_verified: true,
  is_staff: true,
  is_superuser: true,
};

export const createVotingCatalog = (): VotingCatalogItem[] => clone(votingCatalog);
export const createNominationList = (): Nomination[] => clone(nominationList);
export const createNominationDetail = (): Nomination => clone(nominationDetail);
export const createVoteResult = (): VoteResult => clone(voteResult);
export const createAdminVotingList = (): AdminVotingListItem[] => clone(adminVotingList);
export const createAdminVotingDetail = (): AdminVoting => clone(adminVotingDetail);
export const createAdminStats = (): AdminStats => clone(adminStats);
export const createGames = (): Game[] => clone(games);
export const createSuperuserProfile = (): AccountProfile => clone(superuser);
export const createVotingImportPayload = (): VotingImportPayload => clone(votingImportPayload);
export const createVotingImportPreview = (): VotingImportPreview => clone(votingImportPreview);
export const createVotingImportResult = (): VotingImportResult => clone(votingImportResult);
