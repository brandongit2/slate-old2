SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT;
SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS;
SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION;
SET NAMES utf8mb4;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0;
SET @OLD_TIME_ZONE=@@TIME_ZONE;
SET TIME_ZONE='+00:00';

INSERT INTO `articles` VALUES (1,1,'01-slope-review','Slope Review','2019-03-11 02:54:13','2019-03-11 02:54:26','# Slope\nGiven two points, $(x_1,y_1)$ and $(x_2,y_2)$, the slope formed by the line connecting the points can be calculated with:\n$$m=\\frac{y_2-y_1}{x_2-x_1}$$\n###Quadratic formula\nThe roots of a given quadratic function, $ax^2+bx+c$ can be found with the quadratic equation:\n$$x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$$\n## First principal derivative of a quadratic, $f(x)=ax^2+bx+c$:\n$$\n\\begin{aligned}\n\\frac{dy}{dx}&=\\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}\\\\\n&=\\lim_{h\\to 0}\\frac{\\left(a(x+h)^2+b(x+h)+c\\right)-(ax^2+bx+c)}{h}\\\\\n&=\\lim_{h\\to 0}\\frac{\\left(ax^2+ah^2+2axh+bx+bh+c\\right)-(ax^2+bx+c)}{h}\\\\\n&=\\lim_{h\\to 0}\\frac{ax^2+ah^2+2axh+bx+bh+c-ax^2-bx-c}{h}\\\\\n&=\\lim_{h\\to 0}\\frac{ax^2-ax^2+bx-bx+c-c+ah^2+2axh+bh}{h}\\\\\n&=\\lim_{h\\to 0}\\frac{ah^2+2axh+bh}{h}\\\\\n&=\\lim_{h\\to 0}ah+2ax+b\\\\\n\\frac{dy}{dx}=f\'(x)&=2a+b\\\\\n\\end{aligned}\\\\\n$$\n\n## L\'Hopital\'s rule\n$$\\mathop {\\lim }\\limits_{x \\to c} \\frac{{f\\left( x \\right)}}{{g\\left( x \\right)}} = \\mathop {\\lim }\\limits_{x \\to c} \\frac{{f\'\\left( x \\right)}}{{g\'\\left( x \\right)}}$$\n\n## Maxwell\'s Equation - Faraday\'s Law\n$$\\oint_C {E \\cdot d\\ell  =  - \\frac{d}{{dt}}} \\int_S {B_n dA}$$\n\n## Acid Ionization Constant\n$$K_a  = \\frac{{\\left[ {H^ +  } \\right]\\left[ {A^ -  } \\right]}}{{\\left[ {HA} \\right]}}$$\n\n## Discrete-Time Fourier transform of a unit step function\n$$u(n) \\Leftrightarrow \\frac{1}{{(1 - e^{ - j\\omega } )}} + \\sum\\limits_{k =  - \\infty }^\\infty  {\\pi \\delta (\\omega  + 2\\pi k)}$$\n\n## Binomial Coefficient\n$$\\begin{pmatrix}n\\\\k\\\\\\end{pmatrix} = \\frac{n!}{k!\\left(n - k\\right)!}$$\n\n## Radii of stable orbits in the Bohr model\n$$r = n^2 \\frac{{\\hbar ^2 }}{{m_e kZe^2 }} = n^2 \\frac{{a_0 }}{Z}$$\n\n## Van der Waals equation\n$$\\left( {P + \\frac{{an^2 }}{{V^2 }}} \\right)\\left( {V - bn} \\right) = nRT$$\n\n## Sine Definition as an Infinite Series\n$$\\sin x = \\sum\\limits_{n = 1}^\\infty  {\\frac{{\\left( { - 1} \\right)^{n - 1} x^{2n - 1} }}{{\\left( {2n - 1} \\right)!}}}$$',1),(2,2,'01-secant-lines','Secant Lines','2019-03-11 02:54:13','2019-03-11 02:54:26','#yes',1),(3,1,'02-intro-to-limits','Intro to Limits','2019-03-11 02:54:13','2019-03-11 02:54:26','#yes',2),(4,1,'03-the-fundamental-theorem-of-calculus-part-1','The Fundamental Theorem of Calculus, part 1','2019-03-11 02:54:13','2019-03-11 02:54:26','#yes',3);

INSERT INTO `courses` VALUES (1,1,'differential-calculus','Differential calculus','haha calculus',1),(2,2,'integral-calculus','Integral calculus','finding area under curves, antiderivatives, etc.',1),(3,1,'cells','Cells','cells are pretty cool!',2);

INSERT INTO `email_verification` VALUES ('test@example.com','Xn58MHrhf','2030-03-05 01:16:07'),('test2@example.com','VD8d21rhf','2030-03-05 01:16:07');

INSERT INTO `login_tokens` VALUES ('u6P3AojGYYrywrRQ',19,'2019-03-11 02:49:55','2030-04-10 02:50:03',720,1),('Ayudf3AojGxYr121/dTA5',20,'2019-03-11 02:50:46','2030-04-10 02:50:46',720,1),('VtQSzjbwB6iOYZ2g',19,'2019-03-11 02:47:21','2019-04-10 02:47:37',720,0);

INSERT INTO `subjects` VALUES (1,1,'mathematics','Mathematics','Mathematics (from Greek μάθημα máthēma, \"knowledge, study, learning\") includes the study of such topics as quantity, structure, space, and change.','3f73d9'),(2,2,'biology','Biology','wowie isn\'t biology fun','d13692'),(3,3,'chemistry','Chemistry','Chemistry is the scientific discipline involved with elements and compounds composed of atoms, molecules and ions: their composition, structure, properties, behavior and the changes they undergo during a reaction with other substances.','eae02c');

INSERT INTO `units` VALUES (1,1,'01-slopes-of-secant-and-tangent-lines','Slopes of secant and tangent lines','Find the slopes of lines intersecting functions.',1),(2,2,'01-limits','Limits','One of the most important aspects of calculus.',1),(3,1,'02-the-fundamental-theorem-of-calculus','The fundamental theorem of calculus','yeah',2),(4,1,'03-intro-to-cells','Intro to cells','introduction to cells',3);

INSERT INTO `users` VALUES (19,'Brandon','Tsang','brandononline2@gmail.com',_binary '$2b$10$HVQAFl/KaIoDNTyZXkeNFuWuCv2gDfddSNA3sv3Ur.yMem5HFkFfu',1,5,0,'light'),(20,'Test','Account','test@example.com',_binary '$2b$10$U484tur55WgtDpSZUc.EpuYSszhUnnq0t.SfMQxivCbOuKSMMzNbq',1,5,0,'light');

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT;
SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS;
SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION;
SET SQL_NOTES=@OLD_SQL_NOTES;
