import cn from 'classnames';

export const Category = ({
  category,
  selectedCategories,
  setSelectedCategories,
}) => {
  return (
    <a
      data-cy="Category"
      className={cn('button mr-2 my-1', {
        'is-info': selectedCategories.includes(category.title),
      })}
      href="#/"
      onClick={() => {
        if (!selectedCategories.includes(category.title)) {
          setSelectedCategories(currentSelectedCategory => {
            return [...currentSelectedCategory, category.title];
          });
        } else {
          setSelectedCategories(currentSelectedCategory => {
            selectedCategories.splice(
              selectedCategories.indexOf(category.title),
              1,
            );

            return [...currentSelectedCategory];
          });
        }
      }}
    >
      {category.title}
    </a>
  );
};
