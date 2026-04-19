const fuseOptions = {
  includeScore: true,
  shouldSort: true,
  keys: [
    // Blog Keys
    {
      name: 'title',
      weight: 0.75,
    },
    {
      name: 'description',
      weight: 0.5,
    },
    {
      name: 'tags',
      weight: 0.4,
    },
    {
      name: 'category',
      weight: 0.2,
    },

    // Frontend Project Keys
    {
      name: 'title',
      weight: 0.75,
    },
    {
      name: 'description',
      weight: 0.5,
    },
    {
      name: 'tags',
      weight: 0.4,
    },
    {
      name: 'category',
      weight: 0.2,
    },
    {
      name: 'status',
      weight: 0.1,
    },
  ],
};

export default fuseOptions;
