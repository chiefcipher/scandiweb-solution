


export const LOAD_CATEGORIES =
`
  {
    categories {
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
    
    }
    
  }`  


  export const LOAD_CURRENCIES =
`
{
  currencies {
    label
    symbol 
  }
}`  

        


