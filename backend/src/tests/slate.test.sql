SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT;
SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS;
SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION;
SET NAMES utf8;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0; 

INSERT INTO `articles` VALUES (1,1,'01-slope-review','Slope Review','2019-02-05 19:19:21','2019-02-05 19:19:21','ya you gotta find the slopes of things lol',1),(2,2,'01-secant-lines','Secant Lines','2019-02-05 19:20:30','2019-02-05 19:20:30','a secant line is a line which intersects with a function twice.',1),(3,1,'02-intro-to-limits','Intro to Limits','2019-02-05 19:23:23','2019-02-05 19:23:23','A limit takes a function and allows us to know what happens when the function approaches a value.',2),(4,1,'03-the-fundamental-theorem-of-calculus-part-1','The Fundamental Theorem of Calculus, part 1','2019-02-06 17:36:17','2019-02-06 17:36:17','wow',3);

INSERT INTO `units` VALUES (1,1,'01-slopes-of-secant-and-tangent-lines','Slopes of secant and tangent lines','Find the slopes of lines intersecting functions.',1),(2,2,'01-limits','Limits','One of the most important aspects of calculus.',1),(3,1,'02-the-fundamental-theorem-of-calculus','The fundamental theorem of calculus','yeah',2),(4,1,'03-intro-to-cells','Intro to cells','introduction to cells',3);

INSERT INTO `courses` VALUES (1,1,'differential-calculus','Differential calculus','haha calculus',1),(2,2,'integral-calculus','Integral calculus','finding area under curves, antiderivatives, etc.',1),(3,1,'cells','Cells','cells are pretty cool!',2);

INSERT INTO `subjects` VALUES (1,1,'mathematics','Mathematics','Mathematics (from Greek μάθημα máthēma, \"knowledge, study, learning\") includes the study of such topics as quantity, structure, space, and change.','3f73d9'),(2,2,'biology','Biology','wowie isn\'t biology fun','d13692'),(3,3,'chemistry','Chemistry','Chemistry is the scientific discipline involved with elements and compounds composed of atoms, molecules and ions: their composition, structure, properties, behavior and the changes they undergo during a reaction with other substances.','eae02c');

INSERT INTO `login_tokens` VALUES ('9cZ8R3yLIzoFnoCD',1,'2019-03-03 20:02:50','2019-03-04 02:59:11',2,1),('nrSpVUmFJkkZe9Mu',1,'2019-03-02 19:01:57','2019-03-02 21:01:57',2,1),('Prm7fKKrYBAvmHfa',1,'2019-03-02 18:50:42','2019-03-02 20:50:42',2,1),('roljNk51JHF2uxt/',1,'2019-03-02 19:02:42','2019-03-03 04:58:49',2,1),('RqjChel2D67ThRUs',1,'2019-03-02 19:00:21','2019-03-02 21:00:21',2,1),('u6P3AojGYYrywrRQ',1,'2019-03-01 23:25:03','2019-03-02 01:25:03',2,1);

INSERT INTO `users` VALUES (1,'Brandon','Tsang','brandononline2@gmail.com',_binary '$2b$10$jqQTGQiIfWcRx5GgeXazJuWAHghYruM6fN2rD.kz5Y.eYHkmjDdtu',1,5);

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT;
SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS;
SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION;
SET SQL_NOTES=@OLD_SQL_NOTES; 
