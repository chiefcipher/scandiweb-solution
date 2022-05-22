export const GET_CATEGORIES = `
{
  categories {
    name
  }
  
}`;

export const LOAD_CURRENCIES = `
{
  currencies {
    label
    symbol 
  }
}`;

export const LOAD_CATEGORY = (input) => {
  return `
  {category(input : {title : "${input}"}) {
    name
    products {
      name
      id
      inStock
      gallery
      description
      category
      brand
      prices {
        amount
        currency {
          label 
          symbol
        }
          
      }
      attributes {
        id 
        name 
        type
        items    {
          displayValue 
          value
          id
        }
      
      }
      prices {
        currency {
          label 
          symbol
        }
        amount
      }
      
    }
}}
`;
};
