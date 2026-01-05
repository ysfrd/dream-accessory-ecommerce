CREATE DATABASE accessory_store;
USE accessory_store;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    color VARCHAR(30),
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    description TEXT
);

INSERT INTO products (name, category, type, color, price, image_url, description) VALUES
('Basic Hat', 'Hat', 'Basic', 'Brown', 249.90, 'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363852/Basic_Brown_Cap_uh39uu.png', 'Minimal design brown basic hat for daily wear'),
('Basic Hat', 'Hat', 'Basic', 'Gray', 249.90, 'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363851/Basic_Gray_Cap_kjuouv.png', 'Comfortable gray basic hat with a simple style'),
('Symbol Hat', 'Hat', 'Symbol', 'Black', 279.90, 'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363852/Cap_With_Lion_Symbol_gkg0hs.png', 'Stylish hat featuring a unique symbol design'),
('Sport Hat', 'Hat', 'Sport', 'Black', 299.90, 'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363854/Black_Sports_Cap_sxsdp4.png', 'Black sport hat suitable for outdoor and daily activities'),
('Sport Hat', 'Hat', 'Sport', 'White', 299.90, 'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363852/White_Sports_Cap_nozq1d.png', 'Adjustable white sport hat with a modern look');

INSERT INTO products VALUES
(NULL,'Chain Necklace','Necklace','Chain',NULL,199.90,'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363928/Chain_Necklace_uzforj.png','Elegant chain necklace'),
(NULL,'Heart Necklace','Necklace','Heart',NULL,189.90,'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363931/silver_necklace_with_Heart_symbol_ljfs9o.png','Heart-shaped romantic necklace'),
(NULL,'Rose Symbol Necklace','Necklace','Rose',NULL,209.90,'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363933/silver_Necklace_with_Rose_Symbol_hv73za.png','Necklace with rose symbol design');

INSERT INTO products VALUES
(NULL,'Plastic Frame Sunglasses','Sunglasses','Plastic Frame',NULL,349.90,'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363929/Plastic_Frame_Sunglasses_n8bvoy.png','UV protected plastic frame sunglasses'),
(NULL,'Metal Frame Sunglasses','Sunglasses','Metal Frame',NULL,399.90,'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363920/Metal_Frame_Sunglasses_w0fyop.png','Premium metal frame sunglasses'),
(NULL,'Round Sunglasses','Sunglasses','Round',NULL,329.90,'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363919/Round_Sunglasses_x3ka4f.png','Retro round sunglasses design');

INSERT INTO products VALUES
(NULL,'Mesh Strap Watch','Watch','Mesh Strap','Silver',599.90,'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363926/Silver_Mesh_Strap_Watch_myxtwd.png','Classic mesh strap silver watch'),
(NULL,'Mesh Strap Watch','Watch','Mesh Strap','Gold',599.90,'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363927/Gold_Mesh_Strap_Watch_vr3m9y.png','Elegant gold mesh strap watch'),
(NULL,'Silver Watch','Watch','Silver',NULL,649.90,'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363925/Silver_Watch_sjw33y.png','Stylish silver watch'),
(NULL,'Steel Watch','Watch','Steel','Black',699.90,'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363923/Black_Steel_Watch_kssap2.png','Durable steel black watch'),
(NULL,'Steel Watch','Watch','Steel','Gray',699.90,'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363924/Gray_Steel_Watch_te4gh1.png','Modern gray steel watch');

INSERT INTO products VALUES
(NULL,'Leather Bracelet','Bracelet','Leather','Brown',149.90,'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363921/Leather_Bracelet_kjftfr.png','Genuine leather bracelet'),
(NULL,'Silver Bracelet','Bracelet','Silver',NULL,229.90,'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363922/Silver_Bracelet_d48bqh.png','Elegant silver bracelet'),
(NULL,'Rope Bracelet','Bracelet','Rope','Black',99.90,'https://res.cloudinary.com/di7rsyv8w/image/upload/v1767363918/Rope_Bracelet_s1z6hr.png','Casual black rope bracelet');
