import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Snackbar
} from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useCart } from "./context/CartContext";

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then(res => {
        if (!res.ok) {
          throw new Error('API connection error');
        }
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
      if (newCategory === "All") {
        setFilteredProducts(products);
      } else {
        setFilteredProducts(products.filter(p => p.category === newCategory));
      }
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbarMessage(`${product.name} added to cart!`);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <Header />

      <Container maxWidth="xl" sx={{ py: 4, minHeight: '80vh' }}>
        {/* DEĞİŞTİRİLEN BAŞLIK */}
        <Typography variant="h3" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
          Our Products
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Categories
          </Typography>
          <ToggleButtonGroup
            value={selectedCategory}
            exclusive
            onChange={handleCategoryChange}
            aria-label="category filter"
            sx={{ flexWrap: 'wrap', gap: 1 }}
          >
            {categories.map(category => (
              <ToggleButton 
                key={category} 
                value={category}
                sx={{
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: selectedCategory === category ? 'primary.main' : 'grey.300',
                  backgroundColor: selectedCategory === category ? 'primary.main' : 'white',
                  color: selectedCategory === category ? 'white' : 'text.primary',
                  '&:hover': {
                    backgroundColor: selectedCategory === category ? 'primary.dark' : 'grey.100'
                  }
                }}
              >
                {category}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            {selectedCategory === "All" 
              ? `All products (${products.length} products)`
              : `${selectedCategory} category (${filteredProducts.length} products)`
            }
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {filteredProducts.map(product => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={product.imageUrl}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip 
                      label={product.category} 
                      size="small" 
                      color="primary" 
                      variant={selectedCategory === product.category ? "filled" : "outlined"}
                    />
                    {product.type && (
                      <Chip label={product.type} size="small" variant="outlined" />
                    )}
                    {product.color && (
                      <Chip 
                        label={product.color} 
                        size="small" 
                        sx={{ 
                          backgroundColor: product.color.toLowerCase(),
                          color: '#fff',
                          textTransform: 'capitalize'
                        }}
                      />
                    )}
                  </Stack>

                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 2
                    }}
                  >
                    {product.description}
                  </Typography>

                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    {product.price} ₺
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary"
                    size="medium"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />

      <Footer />
    </>
  );
}

export default App;