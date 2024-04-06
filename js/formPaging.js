const formPage1 = document.getElementById("form-page1");
const formPage2 = document.getElementById("form-page2");
const formPage3 = document.getElementById("form-page3");
const formPage4 = document.getElementById("form-page4");
const formPage5 = document.getElementById("form-page5");


function showPage(pageNumber){
    switch(pageNumber){
        case 1:
            formPage1.style.display = 'block';
            formPage2.style.display = 'none';
            formPage3.style.display = 'none';
            formPage4.style.display = 'none';
            formPage5.style.display = 'none';
            break;

        case 2:
            formPage1.style.display = 'none';
            formPage2.style.display = 'block';
            formPage3.style.display = 'none';
            formPage4.style.display = 'none';
            formPage5.style.display = 'none';
            progressBar.value=10;
            break;
            
        case 3:
            formPage1.style.display = 'none';
            formPage2.style.display = 'none';
            formPage3.style.display = 'block';
            formPage4.style.display = 'none';
            formPage5.style.display = 'none';
            progressBar.value=50;
            break;

        case 4:
            formPage1.style.display = 'none';
            formPage2.style.display = 'none';
            formPage3.style.display = 'none';
            formPage4.style.display = 'block';
            formPage5.style.display = 'none';
            progressBar.value=100;
            break;

        case 5:
            formPage1.style.display = 'none';
            formPage2.style.display = 'none';
            formPage3.style.display = 'none';
            formPage4.style.display = 'none';
            formPage5.style.display = 'block';
            updateSummary();
            break;

        default:
            break;
    }
}



  
