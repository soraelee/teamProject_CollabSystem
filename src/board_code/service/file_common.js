const getMessage = (msg, url) =>{
    return `<script>alert('${msg}');
    location.href="${url}";
    </script>`
}