SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT;
SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS;
SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION;
SET NAMES utf8;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0;

INSERT INTO `articles` VALUES (1,1,'01-slope-review','Slope Review','2019-02-05 19:19:21','2019-02-05 19:19:21','ya you gotta find the slopes of things lol',1),(2,2,'01-secant-lines','Secant Lines','2019-02-05 19:20:30','2019-02-05 19:20:30','a secant line is a line which intersects with a function twice.',1),(3,1,'02-intro-to-limits','Intro to Limits','2019-02-05 19:23:23','2019-02-05 19:23:23','A limit takes a function and allows us to know what happens when the function approaches a value.',2),(4,1,'03-the-fundamental-theorem-of-calculus-part-1','The Fundamental Theorem of Calculus, part 1','2019-02-06 17:36:17','2019-02-06 17:36:17','wow',3);

INSERT INTO `courses` VALUES (1,1,'differential-calculus','Differential calculus','haha calculus',1),(2,2,'integral-calculus','Integral calculus','finding area under curves, antiderivatives, etc.',1),(3,1,'cells','Cells','cells are pretty cool!',2);

INSERT INTO `email_verification` VALUES ('test@example.com','Xn58MHrhf','2019-03-05 01:16:07');

INSERT INTO `login_tokens` VALUES ('1xlW2DAtK0ut73Cv',1,'2019-03-04 21:05:00','2019-03-04 23:05:00',2,0),('9cZ8R3yLIzoFnoCD',1,'2019-03-03 20:02:50','2019-03-04 03:05:23',2,0),('Djc0qBtjnYWW5u0x',9,'2019-03-04 13:48:16','2019-03-04 16:52:23',2,0),('GP0cRq5fQQXP6Utv',9,'2019-03-04 21:51:39','2019-04-03 20:52:13',720,0),('hmgB2ktJO7Qt7a7r',9,'2019-03-04 18:09:38','2019-03-04 20:25:27',2,0),('in/YLEdoqOI+Z1HQ',1,'2019-03-04 18:31:23','2019-03-04 22:31:08',2,0),('JNq27IdvKdqy0Bwz',9,'2019-03-04 17:55:32','2019-03-04 20:02:38',2,0),('llBRHhNcUTifDZ9t',1,'2019-03-04 21:06:50','2019-03-04 23:10:28',2,0),('Mg893QHG3hjCCftG',9,'2019-03-06 00:57:08','2019-04-05 00:18:00',720,0),('nrSpVUmFJkkZe9Mu',1,'2019-03-02 19:01:57','2019-03-02 21:01:57',2,0),('PL/dDOEFXsvpFzG+',1,'2019-03-06 01:18:08','2019-04-05 14:41:58',720,1),('Prm7fKKrYBAvmHfa',1,'2019-03-02 18:50:42','2019-03-02 20:50:42',2,0),('Q+2TKz9aV/6AYfH5',9,'2019-03-04 18:26:17','2019-03-04 20:26:19',2,0),('rBtH3hghRrEf5oiT',9,'2019-03-05 14:03:53','2019-04-04 13:04:26',720,0),('roljNk51JHF2uxt/',1,'2019-03-02 19:02:42','2019-03-03 04:58:49',2,0),('RqjChel2D67ThRUs',1,'2019-03-02 19:00:21','2019-03-02 21:00:21',2,0),('u6P3AojGYYrywrRQ',1,'2019-03-01 23:25:03','2100-03-02 01:25:03',2,1),('Ayudf3AojGxYr121',1,'2019-03-01 23:25:03','2100-03-02 01:25:03',2,1),('XDjdP3AojGYYryw1231',1,'2019-03-01 23:25:03','2100-03-02 01:25:03',2,1),('V+6LB+LE5QnGTcHV',9,'2019-03-04 18:04:39','2019-03-04 20:05:41',2,0),('xmmASgdQuA8eli++',9,'2019-03-04 21:04:33','2019-03-04 23:04:33',2,0),('XO4ixH7n1IeIbABB',1,'2019-03-04 18:26:22','2019-03-04 20:31:23',2,0),('zUnJ4JbaMlNAjLJF',9,'2019-03-04 18:25:27','2019-03-04 20:26:17',2,0);

INSERT INTO `subjects` VALUES (1,1,'mathematics','Mathematics','Mathematics (from Greek μάθημα máthēma, \"knowledge, study, learning\") includes the study of such topics as quantity, structure, space, and change.','3f73d9'),(2,2,'biology','Biology','wowie isn\'t biology fun','d13692'),(3,3,'chemistry','Chemistry','Chemistry is the scientific discipline involved with elements and compounds composed of atoms, molecules and ions: their composition, structure, properties, behavior and the changes they undergo during a reaction with other substances.','eae02c');

INSERT INTO `units` VALUES (1,1,'01-slopes-of-secant-and-tangent-lines','Slopes of secant and tangent lines','Find the slopes of lines intersecting functions.',1),(2,2,'01-limits','Limits','One of the most important aspects of calculus.',1),(3,1,'02-the-fundamental-theorem-of-calculus','The fundamental theorem of calculus','yeah',2),(4,1,'03-intro-to-cells','Intro to cells','introduction to cells',3);

INSERT INTO `users` VALUES (1,'Brandon','Tsang','brandononline2@gmail.com',_binary '$2b$10$jqQTGQiIfWcRx5GgeXazJuWAHghYruM6fN2rD.kz5Y.eYHkmjDdtu',1,5,0,'light'),(8,'test','','yes@wow.xxx',_binary '$2b$10$Lvfu9nImjDGCVx9RdouP3udrPzXa7xiLggJt2vzx1Zc3oUMe9qHjC',1,5,0,'light'),(9,'test','','test@example.com',_binary '$2b$10$Djdn./Lau.EVd0IolQceU.gqI6EpBS3T7bkadD1tzhbXWYbkGla9.',1,5,0,'light'),(10,'toDelete','','useless@example.com',_binary '$2b$10$Djdn./Lau.EVd0IolQceU.gqI6EpBS3T7bkadD1tzhbXWYbkGla9.',1,5,0,'light');

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT;
SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS;
SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION;
SET SQL_NOTES=@OLD_SQL_NOTES;
