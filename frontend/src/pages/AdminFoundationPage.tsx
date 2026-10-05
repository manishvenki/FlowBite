import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Store,
  Layers,
  UtensilsCrossed,
  Users,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { restaurantService } from '../services/restaurantService';
import { categoryService } from '../services/categoryService';
import { foodService } from '../services/foodService';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const AdminFoundationPage: React.FC = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    restaurants: 0,
    categories: 0,
    foods: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      restaurantService.getRestaurants(),
      categoryService.getCategories(),
      foodService.getFoods(),
    ])
      .then(([rests, cats, foods]) => {
        setStats({
          restaurants: rests.length,
          categories: cats.length,
          foods: foods.length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Interface Foundation"
        subtitle="Stage 1 Role Architecture & Store Management Foundation (Phase 1 Baseline)"
        action={
          <div className="flex items-center gap-2">
            <Badge variant="terracotta" size="md">
              ADMIN ROLE VERIFIED
            </Badge>
          </div>
        }
      />

      {/* Admin Notice Banner */}
      <div className="p-6 rounded-2xl bg-[#3F4933] text-[#FFFDF5] shadow-card flex items-start gap-4">
        <div className="p-3 rounded-xl bg-olive text-white shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-serif-title text-lg font-bold">
            Welcome, Administrator ({user?.name})
          </h3>
          <p className="text-xs text-[#FFFDF5]/80 leading-relaxed">
            Your account holds role <strong className="text-white">ADMIN</strong>. As specified in Phase 1 Foundation, this interface foundation is protected and restricted strictly to store administrators. Deep kitchen dispatch and inventory controls unlock in subsequent phases.
          </p>
        </div>
      </div>

      {/* Database Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 rounded-2xl bg-olive/15 text-olive">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-olive-dark/60 font-semibold uppercase tracking-wider">
              Active Kitchens
            </p>
            <p className="text-2xl font-bold font-serif-title text-olive-dark mt-0.5">
              {loading ? '...' : stats.restaurants}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 rounded-2xl bg-sand text-olive-dark">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-olive-dark/60 font-semibold uppercase tracking-wider">
              Cuisine Categories
            </p>
            <p className="text-2xl font-bold font-serif-title text-olive-dark mt-0.5">
              {loading ? '...' : stats.categories}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 rounded-2xl bg-terracotta/15 text-terracotta">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-olive-dark/60 font-semibold uppercase tracking-wider">
              Available Dishes
            </p>
            <p className="text-2xl font-bold font-serif-title text-olive-dark mt-0.5">
              {loading ? '...' : stats.foods}
            </p>
          </div>
        </Card>
      </div>

      {/* Security & Access Overview */}
      <Card className="p-6 space-y-4">
        <h4 className="font-serif-title text-lg font-bold text-olive-dark pb-2 border-b border-sand-border/60">
          Role-Based Access Enforcement
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-olive-dark/80">
          <div className="p-4 rounded-xl bg-sand/30 border border-sand-border/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-olive-deep">
              <CheckCircle2 className="w-4 h-4 text-olive" />
              <span>Customer Interface (/home, /cart, /restaurants)</span>
            </div>
            <p className="text-olive-dark/70 leading-relaxed">
              Accessible to both unauthenticated guests and authenticated USER accounts with seamless ordering flow.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-sand/30 border border-sand-border/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-terracotta-dark">
              <Lock className="w-4 h-4 text-terracotta" />
              <span>Admin Protected Endpoints (/admin, POST /restaurants, POST /foods)</span>
            </div>
            <p className="text-olive-dark/70 leading-relaxed">
              Enforced at both backend middleware level (<code className="bg-sand/60 px-1 py-0.5 rounded">authorize('ADMIN')</code>) and frontend route guards.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
