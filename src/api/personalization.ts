import { apiClient } from './client';

export interface HomePageModal {
  id: number;
  title: string;
  content: string;
  button_text: string;
  button_url: string;
  modal_type: 'info' | 'warning' | 'success' | 'promo';
  display_once: boolean;
  start_date: string | null;
  end_date: string | null;
  order: number;
}

export interface HomePageModalInput {
  title: string;
  content: string;
  button_text?: string;
  button_url?: string;
  modal_type?: 'info' | 'warning' | 'success' | 'promo';
  is_active?: boolean;
  display_once?: boolean;
  start_date?: string | null;
  end_date?: string | null;
  order?: number;
}

/**
 * Fetch active homepage modals for display
 */
export const fetchHomePageModals = async (): Promise<HomePageModal[]> => {
  const response = await apiClient.get<HomePageModal[]>('/personalization/homepage-modals');
  return response.data;
};

/**
 * Fetch all homepage modals for admin (requires superuser)
 */
export const fetchAdminHomePageModals = async (): Promise<HomePageModal[]> => {
  const response = await apiClient.get<HomePageModal[]>('/personalization/admin/homepage-modals');
  return response.data;
};

/**
 * Create a new homepage modal (requires superuser)
 */
export const createHomePageModal = async (
  payload: HomePageModalInput,
): Promise<HomePageModal> => {
  const response = await apiClient.post<HomePageModal>(
    '/personalization/admin/homepage-modals',
    payload,
  );
  return response.data;
};

/**
 * Update a homepage modal (requires superuser)
 */
export const updateHomePageModal = async (
  modalId: number,
  payload: HomePageModalInput,
): Promise<HomePageModal> => {
  const response = await apiClient.put<HomePageModal>(
    `/personalization/admin/homepage-modals/${modalId}`,
    payload,
  );
  return response.data;
};

/**
 * Delete a homepage modal (requires superuser)
 */
export const deleteHomePageModal = async (modalId: number): Promise<void> => {
  await apiClient.delete(`/personalization/admin/homepage-modals/${modalId}`);
};
