export const QueryClient = jest.fn().mockImplementation(() => ({
  clear: jest.fn(),
  cancelQueries: jest.fn(),
  invalidateQueries: jest.fn(),
  refetchQueries: jest.fn(),
  setQueryData: jest.fn(),
  getQueryData: jest.fn(),
}));

export const QueryClientProvider = ({ children }: { children: React.ReactNode }) => children;

export const useQuery = jest.fn().mockReturnValue({
  data: undefined,
  error: null,
  isLoading: false,
  isError: false,
  isSuccess: true,
  refetch: jest.fn(),
});

export const useMutation = jest.fn().mockReturnValue({
  mutate: jest.fn(),
  mutateAsync: jest.fn(),
  isLoading: false,
  isError: false,
  isSuccess: false,
  reset: jest.fn(),
});

// Reset query mocks helper
export const resetQueryMocks = () => {
  useQuery.mockClear();
  useMutation.mockClear();
};
