"use client"

import { FormEvent, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addLink, getCurrentAccount, switchToBaseSepolia } from "@/lib/web3/contract";
import { toast } from "sonner";

type DialogRegisterLinkProps = {
  onLinkAdded?: () => void;
};

export default function DialogRegisterLink({ onLinkAdded }: DialogRegisterLinkProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    description: ""
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Verifica se há uma conta conectada
      const account = await getCurrentAccount();
      
      if (!account) {
        toast.error("Please connect your wallet first");
        setLoading(false);
        return;
      }

      // Garante que está na rede Base Sepolia Testnet
      await switchToBaseSepolia();

      // Chama a função addLink do contrato
      toast.info("Please confirm the transaction in your wallet");
      
      await addLink(
        formData.title,
        formData.description,
        formData.url,
        account
      );

      toast.success("Link registered successfully!");
      
      // Reseta o formulário
      setFormData({
        url: "",
        title: "",
        description: ""
      });

      setOpen(false);
      
      // Recarrega a lista de links
      if (onLinkAdded) {
        onLinkAdded();
      }
    } catch (error) {
      console.error("Error adding link:", error);
      
      if (error instanceof Error) {
        if (error.message.includes("User rejected")) {
          toast.error("Transaction rejected by user");
        } else if (error.message.includes("Already been Registered")) {
          toast.error("This link has already been registered by you");
        } else {
          toast.error("Error registering link: " + error.message);
        }
      } else {
        toast.error("Error registering link. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="relative z-10 py-4 md:py-6 px-6 md:px-8 rounded-xl border border-white/20 bg-lavender-blue/80 backdrop-blur-xl text-blue-primary text-sm md:text-base cursor-pointer shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.05] hover:underline overflow-hidden font-semibold w-full md:w-auto">
          <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          Register Link
        </Button>
      </DialogTrigger>

      <DialogContent className="fixed! z-100! border border-white/20 bg-lavender-blue/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 sm:max-w-125 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent pointer-events-none -z-10" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <DialogHeader className="relative z-10">
          <DialogTitle className="text-blue-primary font-sherika font-bold text-xl md:text-2xl flex items-center gap-2">
            <ExternalLink className="w-5 h-5 md:w-6 md:h-6" />
            Register New Link
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4 relative z-10">
          <div className="flex flex-col gap-2">
            <label className="text-dark-blue font-semibold text-xs md:text-sm">URL</label>
            <Input
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(event) => setFormData({ ...formData, url: event.target.value })}
              className="border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 md:py-3 text-sm md:text-base text-blue-primary placeholder:text-dark-blue/50 focus:ring-2 focus:ring-blue-primary/50 focus:border-transparent transition-all"
              disabled={loading}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-dark-blue font-semibold text-xs md:text-sm">Title</label>
            <Input
              type="text"
              placeholder="Enter link title"
              value={formData.title}
              onChange={(event) => setFormData({ ...formData, title: event.target.value })}
              className="border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 md:py-3 text-sm md:text-base text-blue-primary placeholder:text-dark-blue/50 focus:ring-2 focus:ring-blue-primary/50 focus:border-transparent transition-all"
              disabled={loading}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-dark-blue font-semibold text-xs md:text-sm">Description</label>
            <Textarea
              placeholder="Enter link description"
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              className="border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 md:py-3 text-sm md:text-base text-blue-primary placeholder:text-dark-blue/50 focus:ring-2 focus:ring-blue-primary/50 focus:border-transparent transition-all min-h-20 md:min-h-25 resize-none"
              disabled={loading}
              required
            />
          </div>

          <div className="flex gap-3 mt-2 md:mt-4">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="relative z-10 flex-1 py-2 md:py-3 px-4 md:px-6 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-sm md:text-base text-dark-blue cursor-pointer shadow-lg shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] hover:underline overflow-hidden font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="relative z-10 flex-1 py-2 md:py-3 px-4 md:px-6 rounded-xl border border-white/20 bg-lavender-blue/80 backdrop-blur-xl text-sm md:text-base text-blue-primary cursor-pointer shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] hover:underline overflow-hidden font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                "Register"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}