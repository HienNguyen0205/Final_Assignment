$(function () {
    // tooltip
    $('[data-bs-toggle="tooltip"]').tooltip()
    // datetime
    function dateTimeHandle() {
        var today = new Date()
        var temp = today.toDateString()
        temp = temp.split(' ')
        var date = temp[0] + ', ' + temp[1] + ' ' + temp[2] + ', ' + temp[3]
        var time = today.getHours() + ":" + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes() + ":" + (today.getSeconds() < 10 ? '0' : '') + today.getSeconds()
        $('#date').text(date)
        $('#time').text(time)
    }
    setInterval(dateTimeHandle, 1000)
    // Chart

    var chart1 = document.querySelector('#chart1').getContext('2d')
    var chart2 = document.querySelector('#chart2').getContext('2d')

    function createChart(chart, type, opt) {
        new Chart(chart, {
            type: type,
            data: opt.data,
            options: opt.opt
        })
    }

    function pieOpt (label, bgColor, quantity, pos, title) {
        let data = {
            labels: label,
            datasets: [{
                backgroundColor: bgColor,
                borderColor: '#26292f',
                hoverOffset: 6,
                data: quantity
            }]
        }
        let opt = {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: pos,
                    labels: {
                        font: {
                            size: 14,
                        }
                    }
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 18
                    }
                }
            }
        }
        return {data: data, opt: opt}
    }

    const pie1_legend = ['Income', 'Spending']
    const pie1_bg = ['#4b961c', '#ff084a']
    const pie1_title = 'Today Income/Spending Scale'

    const pie2_legend = ['Deposit', 'Withdraw','Tranfer','Top-up Card']
    const pie2_bg = ['#4b961c', '#ff084a','#03396c','#ffbf00']
    const pie2_title = 'Today Transaction Scale'

    createChart(chart1, 'doughnut', pieOpt(pie1_legend, pie1_bg, [50, 50], 'right', pie1_title))
    createChart(chart2, 'doughnut', pieOpt(pie2_legend, pie2_bg, [20, 30, 40, 10], 'right', pie2_title))

    // sidebar handle

    let currShow = 'home'

    function showSection(section) {
        $('#'+currShow).fadeOut()
        $('#'+section.replace(' ','-').toLowerCase()).fadeIn()
        $('#section-name').text(section)
        $('#section-expand').text('')
    }

    $('#home-btn').click(function (){
        showSection('Home')
    })

    $('#history-btn').click(function (){
        showSection('History')
    })

    $('#dashboard-btn').click(function (){
        showSection('Dashboard')
    })

    $('#account-btn').click(function (){
        showSection('Your Account')
    })

    // show/hide password

    let flag = true
    let balance = $('#balance').text()

    $('.show-pass').click(function (){
        if(flag){
            $('#balance').text('*'.repeat(balance.length))
            $('.show-pass').addClass('fa-eye-slash')
            $('.show-pass').removeClass('fa-eye')
        }else{
            $('#balance').text(balance)
            $('.show-pass').addClass('fa-eye')
            $('.show-pass').removeClass('fa-eye-slash')
        }
        flag = !flag
    })

    //section name handle

    $('#section-name').click(function (){
        console.log('lol')
        const sectionName = $('#section-name').attr('section-name')
        if($('#section-expand').text() != ''){
            $('#'+sectionName).fadeIn()
            $('#section-expand').text('')
        }
    })

    function showFunction(name){
        $('#section-expand').text(' > ' + name)
        $('#home').fadeOut()
    }

    // deposit handle

    $('#deposit').click(function (){
        showFunction('Deposit')
    })

    // withdraw handle

    $('#withdraw').click(function (){
        showFunction('Withdraw')
    })

    // tranfer handle

    $('#tranfer').click(function (){
        showFunction('Tranfer')
    })

    // deposit handle

    $('#toppUp-card').click(function (){
        showFunction('Top-up Card')
    })

})