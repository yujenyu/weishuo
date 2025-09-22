export type Item = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
};

export type CreateForm = {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
};
