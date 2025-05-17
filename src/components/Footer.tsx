import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-4 px-6 border-t bg-background">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Amol. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
