/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

import { User } from './components/User';
import { Category } from './components/Category';
import { Product } from './components/Product';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(c => c.id === product.categoryId);
  const user = usersFromServer.find(u => u.id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

function setProductsSorted(category, setSortBy, sortCount, setSortCount) {
  setSortCount(prev => prev + 1);
  if (sortCount >= 2) {
    setSortCount(0);
  }

  setSortBy(category);
}

export const App = () => {
  const [activeUser, setActiveUser] = useState('All');
  const [inputField, setInputField] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [sortCount, setSortCount] = useState(0);
  const categories = ['ID', 'Product', 'Category', 'User'];

  let filteredProducts = products;

  const isOutlined =
    !inputField &&
    activeUser === 'All' &&
    !selectedCategories.length &&
    sortCount === 0;

  if (activeUser !== 'All') {
    filteredProducts = products.filter(
      product => product.user.name === activeUser,
    );
  }

  if (inputField) {
    const normalized = inputField.trim().toLowerCase();

    filteredProducts = filteredProducts.filter(product => {
      return product.name.toLowerCase().includes(normalized);
    });
  }

  if (selectedCategories.length) {
    filteredProducts = filteredProducts.filter(product => {
      return selectedCategories.includes(product.category.title);
    });
  }

  if (sortBy) {
    switch (sortBy) {
      case 'ID':
        if (sortCount === 2) {
          filteredProducts = filteredProducts.sort((a, b) => b.id - a.id);
        } else {
          filteredProducts = filteredProducts.sort((a, b) => a.id - b.id);
        }

        break;

      case 'Product':
        if (sortCount === 0) {
          filteredProducts = filteredProducts.sort((a, b) => a.id - b.id);
        } else if (sortCount === 2) {
          filteredProducts = filteredProducts.sort((a, b) => {
            return b.name.localeCompare(a.name);
          });
        } else {
          filteredProducts = filteredProducts.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
        }

        break;

      case 'Category':
        if (sortCount === 0) {
          filteredProducts = filteredProducts.sort((a, b) => a.id - b.id);
        } else if (sortCount === 2) {
          filteredProducts = filteredProducts.sort((a, b) => {
            return b.category.title.localeCompare(a.category.title);
          });
        } else {
          filteredProducts = filteredProducts.sort((a, b) => {
            return a.category.title.localeCompare(b.category.title);
          });
        }

        break;

      case 'User':
        if (sortCount === 0) {
          filteredProducts = filteredProducts.sort((a, b) => a.id - b.id);
        } else if (sortCount === 2) {
          filteredProducts = filteredProducts.sort((a, b) => {
            return b.user.name.localeCompare(a.user.name);
          });
        } else {
          filteredProducts = filteredProducts.sort((a, b) => {
            return a.user.name.localeCompare(b.user.name);
          });
        }

        break;

      default:
        filteredProducts = filteredProducts.sort((a, b) => a.id - b.id);
        break;
    }
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({ 'is-active': activeUser === 'All' })}
                onClick={() => {
                  setActiveUser('All');
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <User
                  user={user}
                  activeUser={activeUser}
                  setActiveUser={setActiveUser}
                  key={user.id}
                />
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={inputField}
                  onChange={event => {
                    setInputField(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {inputField && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setInputField('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6', {
                  'is-outlined': selectedCategories.length > 0,
                })}
                onClick={() => setSelectedCategories([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <Category
                  category={category}
                  key={category.id}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                />
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className={cn('button is-link is-fullwidth', {
                  'is-outlined': isOutlined,
                })}
                onClick={() => {
                  setActiveUser('All');
                  setInputField('');
                  setSelectedCategories([]);
                  setSortCount(0);
                  setSortBy('All');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length > 0 ? (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  {categories.map(category => (
                    <th key={category}>
                      <span className="is-flex is-flex-wrap-nowrap">
                        {category}
                        <a href="#/">
                          <span
                            className="icon"
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                setProductsSorted(
                                  category,
                                  setSortBy,
                                  sortCount,
                                  setSortCount,
                                );
                              }
                            }}
                            onClick={() =>
                              setProductsSorted(
                                category,
                                setSortBy,
                                sortCount,
                                setSortCount,
                              )
                            }
                          >
                            <i
                              data-cy="SortIcon"
                              className={cn('fas', {
                                'fa-sort':
                                  sortBy !== category || sortCount === 0,
                                'fa-sort-up':
                                  sortBy === category && sortCount === 1,
                                'fa-sort-down':
                                  sortBy === category && sortCount === 2,
                              })}
                            />
                          </span>
                        </a>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(product => (
                  <Product product={product} key={product.id} />
                ))}
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
